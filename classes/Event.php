<?php

class Event {
    private $_db,
            $_data,
            $_teams,
            $_ismine;

    public function __construct($eventCode = null, $ownerCode = null) {
        $this->_db = DB::getInstance();
        
        if(!$eventCode) {
            // create new event
            $this->_teams = array();
        } else {
            // find event and get teams
            $this->find($eventCode);
            $this->getTeams();
        }

        //check if owner code was passed in and set ismine
        if(!$ownerCode) {
            $this->_ismine = false;
        } else {
            //check if owner code matches the owner code of the event
            $this->_ismine = $ownerCode === $this->_data->ownercode;
        }
    }

    public static function addTeam($team) {
        $_db = DB::getInstance();
        //create team code
        //$team['teamcode'] = createEventTeamCode();
        $attempts = 0;
        while($attempts < 10) {
            //create a unique team code
            $teamcode = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 8);
            //check if team code already exists
            $data = $_db->get('eventteams', array('teamcode', '=', $teamcode));
            if(!$data->count()) {
                //return $teamcode;
                $team['teamcode'] = $teamcode;
                break;
            }
            $attempts++;

        }
        //insert team into eventteams table and return team code if successful
        if($_db->insert('eventteams', $team)) {
            return $team['teamcode'];
        }
        return false;
    }

    public static function deleteTeam($teamcode) {
        $_db = DB::getInstance();
        if($_db->delete('eventteams', array('teamcode', '=', $teamcode))) {
            return true;
        }
        return false;
    }

    public static function updateTeam($teamcode, $fields) {
        $_db = DB::getInstance();
        if($_db->update('eventteams', $teamcode, $fields)) {
            return true;
        }
        return false;
    }

    private function find($eventCode = null) {
        if($eventCode) {
            $data = $this->_db->get('events', array('eventCode', '=', $eventCode));

            if($data->count()) {
                $this->_data = $data->first();
                return true;
            }
        }
        return false;
    }

    public static function checkIsOpen($eventCode) {
        $_db = DB::getInstance();
        $data = $_db->get('events', array('eventCode', '=', $eventCode));
        if($data->count()) {
            $event = $data->first();
            return $event->status === 'open';
        }
        return false;
    }

    private function getTeams() {
        $data = $this->_db->get('eventteams', array('eventid', '=', $this->_data->id));

        if($data->count()) {
            $this->_teams = $data->results();
            return true;
        }
        return false;
    }

    public function data(){
        return $this->_data;
    }

    public function teams(){
        return $this->_teams;
    }

    public function isMine(){
        return $this->_ismine;
    }
}
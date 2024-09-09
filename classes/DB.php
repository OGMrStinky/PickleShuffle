<?php


class DB {
    private static $_instance = null;
    private $_pdo,
            $_query,
            $_error = false,
            $_errinfo,
            $_results,
            $_count = 0,
            $_id;

    private function __construct() {
        try {
            $this->_pdo = new PDO('mysql:host=' . Config::get('mysql/host') . ';dbname=' . Config::get('mysql/db'), Config::get('mysql/username'), Config::get('mysql/password'));
        } catch(PDOException $e) {
            die($e->getMessage());
        }
    }

    public static function getInstance() {
        if(!isset(self::$_instance)) {
            self::$_instance = new DB();
        }
        return self::$_instance;
    }

    public function query($sql, $params = array()) {
        $this->_error = false;
        /*print $sql;
        print "<pre>";
        print_r($params);
        print "</pre>";
        */
        if($this->_query = $this->_pdo->prepare($sql)) {
            $x = 1;
            if(count($params)) {
                foreach($params as $param) {
                    $this->_query->bindValue($x, $param);
                    $x++;
                }
            }

            if($this->_query->execute()) {
                $this->_results = $this->_query->fetchAll(PDO::FETCH_OBJ);
                $this->_count = $this->_query->rowCount();
            } else {
                $this->_error = true;
                $this->_errinfo = $this->_query->errorInfo();
            }
        }

        return $this;
    }

    public function action($action, $table, $where = array()) {
        if(count($where) === 3) {
            $operators = array('=', '>', '<', '>=', '<=');

            $field = $where[0];
            $operator = $where[1];
            $value = $where[2];

            if(in_array($operator, $operators)) {
                $sql = "{$action} FROM {$table} WHERE {$field} {$operator} ?";

                if(!$this->query($sql, array($value))->error()) {
                    return $this;
                }
            }

        }

        return false;
    }

    public function insertIngredOrUnit($table, $value, $userID) {
        if($table == 'units'){
            $sql = "INSERT INTO {$table} (`UnitName`, `UserID`) VALUES (?,?) ON DUPLICATE KEY UPDATE UnitName = ?";
            if(!$this->query($sql, array($value, $userID, $value))->error()) {
                $this->_id = $this->_pdo->lastInsertId();
                if($this->_id == 0){
                    if($this->action("SELECT *", "units", array("UnitName", "=", $value))){
                        $this->_id = $this->first()->UnitID;
                    }
                }
            }
            return true;
        } else{
            $sql = "INSERT INTO {$table} (`IngredName`, `UserID`) VALUES (?,?) ON DUPLICATE KEY UPDATE IngredName = ?";
            if(!$this->query($sql, array($value, $userID, $value))->error()) {
                $this->_id = $this->_pdo->lastInsertId();
                if($this->_id == 0){
                    if($this->action("SELECT *", "ingredients", array("IngredName", "=", $value))){
                        $this->_id = $this->first()->IngredID;
                    }
                }
            }
            return true;
        }

        return false;
    }

    public function insert($table, $fields = array()) {
        $keys = array_keys($fields);
        $values = null;
        $x = 1;

        foreach($fields as $field) {
            $values .= '?';
            if ($x < count($fields)) {
                $values .= ', ';
            }
            $x++;
        }

        $sql = "INSERT INTO {$table} (`" . implode('`, `', $keys) . "`) VALUES ({$values})";

        if(!$this->query($sql, $fields)->error()) {
            $this->_id = $this->_pdo->lastInsertId();
            return true;
        }

        return false;
    }

    public function update($table, $id, $fields) {
        $set = '';
        $x = 1;
    
        foreach($fields as $name => $value) {
            $set .= "{$name} = ?";
            if($x < count($fields)) {
                $set .= ', ';
            }
            $x++;
        }
    
        // Use a parameter placeholder for the id
        if($table == "eventteams"){
            $sql = "UPDATE {$table} SET {$set} WHERE teamcode = ?";
        } else {
            $sql = "UPDATE {$table} SET {$set} WHERE id = ?";
        }
    
        // Add the id to the fields array
        $fields[] = $id;
    
        //echo $sql;
        if(!$this->query($sql, $fields)->error()) {
            return true;
        }
    
        return false;
    }

    public function delete($table, $where) {
        return $this->action('DELETE ', $table, $where);
    }

    public function get($table, $where) {
        return $this->action('SELECT *', $table, $where);
    }

    public function results() {
        return $this->_results;
    }

    public function first() {
        $data = $this->results();
        return $data[0];
    }

    public function count() {
        return $this->_count;
    }

    public function error() {
        return $this->_error;
    }

    public function errorinfo(){
        return $this->_errinfo;
    }
    public function lastId(){
        return $this->_id;
    }
}
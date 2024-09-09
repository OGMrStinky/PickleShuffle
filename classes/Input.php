<?php


class Input {
    public static function exists($type = 'post') {
        //var_dump($_SERVER);
        switch($type) {
            case 'post':
                return (!empty($_POST)) ? true : false;
                break;
            case 'get':
                return (!empty($_GET)) ? true : false;
                break;
            default:
                return false;
                break;
        }
    }

    public static function get($item, $escaped = false) {
        if(isset($_POST[$item])) {
            if($escaped) {
                return self::escape($_POST[$item]);
            }
            return $_POST[$item];
        } else if(isset($_GET[$item])) {
            if($escaped) {
                return self::escape($_GET[$item]);
            }
            return $_GET[$item];
        }

        return '';
    }

    public static function escape($string) {
        return htmlentities($string, ENT_QUOTES, 'UTF-8');
    }
}
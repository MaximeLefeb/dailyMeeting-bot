<?php
    namespace Controller;

    use mysqli;

    class DatabaseConnection {
        public $db = null;

        public function __construct () {
            if (!is_null($this->db)) {
                return $this->db;
            } else {
                $this->db = mysqli_connect(
                    "localhost", //* Host
                    "root", //* User
                    "", //* Password
                    "scurmacolyte" //* Database
                );
            }

            mysqli_set_charset($this->db, 'utf8');
        }
    }
?>

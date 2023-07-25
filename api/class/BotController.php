<?php
    namespace Controller;

    use Controller\DatabaseConnection;
    use mysqli;

    class BotController {
        private $mysqli;

        public function __construct() {
            $this->mysqli = new DatabaseConnection();
        }

        /**
         * @return string - JSON de tous les workers
         */
        public function getAllWorker():string {
            $req      = mysqli_query($this->mysqli->db, 'SELECT * FROM workers');
            $responses = [];

            while ($worker = mysqli_fetch_assoc($req)) {
                array_push($responses, $worker);
            }

            return json_encode($responses);
        }

        /**
         * @param int $id - Id du worker a recuperer
         * 
         * @return string - JSON contenant le worker trouvé
         */
        public function getWorkerById(int $id):string {
            $req = mysqli_query($this->mysqli->db, "SELECT * FROM workers WHERE id={$id}");

            return json_encode(mysqli_fetch_assoc($req));
        }

        /**
         * @return array - JSON de toutes les réponses au bot
         */
        public function getAllResponse():string {
            $req       = mysqli_query($this->mysqli->db, 'SELECT * FROM response');
            $responses = [];

            while ($response = mysqli_fetch_assoc($req)) {
                array_push($responses, $response);
            }

            return json_encode($responses);
        }

        /**
         * @param int $id - Id de la réponse a recuperer
         * 
         * @return string - JSON contenant la reponse trouvée
         */
        public function getResponseById(int $id):string {
            $req = mysqli_query($this->mysqli->db, "SELECT * FROM response WHERE id={$id}");

            return json_encode(mysqli_fetch_assoc($req));
        }

        /**
         * @param array $post - Alias de $_POST [
         *      username(string)*
         *      id_user(int)*
         *      step(int)*
         *      id_guild(int)*
         * ]
         * 
         * @return string - JSON du status de la requete INSERT
         */
        public function addWorker(array $post):string {
            $username = htmlentities(htmlspecialchars($post["username"]));
            $idUser   = $post["id_user"];
            $step     = $post["step"];
            $idGuild  = $post['id_guild'];
            $sql      = "INSERT INTO workers (id_user, username, step, id_guild) VALUES ('{$idUser}', '{$username}', '{$step}', '{$idGuild}')";

            if (mysqli_query($this->mysqli->db, $sql)) {
                return json_encode([
                    "status"  => 201,
                    "message" => "201 - POST OK"
                ]);
            } else {
                return json_encode([
                    "status"  => 500,
                    "message" => "500 - POST ERROR: Ajout worker échoué"
                ]);
            }
        }

        /**
         * @param array $put - Alias de $_PUT [
         *      status(int)*
         *      id_user(int)*
         * ]
         * 
         * @return string - JSON du status de la requete UPDATE
         */
        public function updateWorkerStatus(array $put):string {
            $sqlSet = '';

            if (!empty($put["status"])) {
                $status = intval($put["status"]);

                (strlen($sqlSet) == 0) ? $sqlSet .= "status ='{$status}'" : $sqlSet .= "-status ='{$status}'";
            }

            $sql = "UPDATE workers SET {$sqlSet} WHERE id_user=" . $put["id_user"];

            if (mysqli_query($this->mysqli->db, $sql)) {
                return json_encode([
                    "status"  => 202,
                    "message" => "202 - PUT OK"
                ]);
            } else {
                return json_encode([
                    "status"  => 500,
                    "message" => "500 - PUT ERROR: Modification worker échouée"
                ]);
            }
        }

        /**
         * @param int $id - Id du worker a supprimer
         * 
         * @return string - JSON du status de la requete DELETE
         */
        public function deleteWorker(int $id):string {
            if (mysqli_query($this->mysqli->db, "DELETE FROM workers WHERE id_user={$id}")) {
                return json_encode([
                    "status"  => 1,
                    "message" => "200 - DELETE OK"
                ]);
            } else {
                return json_encode([
                    "status"  => 0,
                    "message" => "DELETE ERROR: Suppression worker échouée"
                ]);
            }
        }
    }
?>
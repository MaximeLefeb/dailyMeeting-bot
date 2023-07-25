<?php
    use Controller\BotController;
    use Loader\Autoloader;

    require('config.php');
    require('./class/Autoloader.php');

    Autoloader::register();

    $botController = new BotController;

    //* API methods
    switch ($_SERVER["REQUEST_METHOD"]) {
        case 'GET';
            echo((!empty($_GET["id"]) ? $botController->getWorkerById((int)$_GET["id"]) : $botController->getAllWorker()));
            echo((!empty($_GET["id_user"]) ? $botController->getResponseById((int)$_GET["id_user"]) : $botController->getAllResponse()));
        break;

        case 'POST':
            echo($botController->addWorker($_POST));
        break;

        case 'PUT':
            $_PUT = [];

            parse_str(file_get_contents('php://input'), $_PUT);

            echo($botController->updateWorkerStatus($_PUT));
        break;

        case 'DELETE':
            echo($botController->deleteWorker((int)$_GET["id_user"]));
        break;
    }
?>

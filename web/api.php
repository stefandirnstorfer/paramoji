<?php
#ini_set('display_errors', 1);
#ini_set('display_startup_errors', 1);
#error_reporting(E_ALL);

# Zugangsdaten
$db_server = '';
$db_benutzer = '';
$db_passwort = '';
$db_name = '';
$MW_SECRET_KEY = "";
include 'init.php';


$con = new mysqli($db_server, $db_benutzer, $db_passwort, $db_name);

$queryCreateUsersTable = "CREATE TABLE IF NOT EXISTS `WORK` (
  `ID` int(8) unsigned NOT NULL auto_increment PRIMARY KEY,
  `WORKER_ID` varchar(255) NOT NULL,
  `CAMPAIGN_ID` varchar(255) NOT NULL,
  `DATE` TIMESTAMP NOT NULL,
  `WORK` LONGTEXT NOT NULL)";

$result = $con->query($queryCreateUsersTable);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     $raw_data = file_get_contents('php://input');
     // The request is using the POST method
     $data = json_decode($raw_data, TRUE);

     $WORKER_ID = $data['workerId'];
     $CAMPAIGN_ID = $data['campaignId'];
     $TASK_ID = $data['taskId'];

     $String_final = $CAMPAIGN_ID . $WORKER_ID . $TASK_ID . $MW_SECRET_KEY;
     $vcode = "mw-" . hash("sha256", $String_final);

     $stat = $con->prepare("INSERT INTO WORK (`date`, `WORKER_ID`, `CAMPAIGN_ID`, `work`) VALUES(NOW(),?,?,?)");
     $stat->bind_param("sss", $WORKER_ID, $CAMPAIGN_ID, $raw_data);
     $stat->execute();

     header('Content-Type: application/json; charset=utf-8');
     echo json_encode(array("vcode" => $vcode));
} else {
     $CAMPAIGN_ID = $_GET['CAMPAIGN_ID'];
     $MIN_ID = (int) $_GET['FROM_ID'] | 0;
     $stat = $con->prepare("select * from `WORK` where `CAMPAIGN_ID`=? and `ID`>?");
     $stat->bind_param("si", $CAMPAIGN_ID, $MIN_ID);
     $stat->execute();
     $result = $stat->get_result();
     $data = [];
     while ($row = $result->fetch_assoc())
     {
         $row['WORK'] = json_decode($row['WORK']);
         $data[] = $row;
     }
     header('Content-Type: application/json; charset=utf-8');
     echo json_encode($data);
}
?>

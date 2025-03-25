<?php
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "world";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $db_name, $port);
if ($conn->connect_error) {
    die("Connection Error: " . $conn->connect_error);
}

?>

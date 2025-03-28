<?php
include("connection.php");

// Güvenlik için POST değişkenini kontrol et
if (!isset($_POST['user_id'])) {
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

$user_id = $_POST['user_id'];

// Hazırlanmış sorgu kullanarak SQL enjeksiyonunu önlüyoruz
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$userdata = [];

while ($row = $result->fetch_assoc()) {
    $userdata[] = $row;
}

// JSON formatı belirle
header('Content-Type: application/json');
echo json_encode($userdata);

?>

<?php
session_start();
include("connection.php");
$response = ["success" => True, "error" => ""];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Kullanıcı girişi kontrolü (kullanıcı oturumunun açık olması gerekir)
    if (!isset($_SESSION['email'])) {
        die("Lütfen giriş yapın");
    }

    // Formdan gelen veriyi al
    $updated_name = $_POST['updated_name'];
    $email = $_SESSION['email'];

    $query = "UPDATE users SET displayname = ? WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $updated_name, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode($response);
    } else {
        $response["error"] = "Error uploading image.";
        echo json_encode($response);
    }

    // Veritabanı bağlantısını kapat
    $stmt->close();
    $conn->close();
}
?>

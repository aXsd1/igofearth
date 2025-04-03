<?php
session_start();
include("connection.php");

$response = ["success" => true, "error" => ""];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Kullanıcı girişi kontrolü (kullanıcı oturumunun açık olması gerekir)
    if (!isset($_SESSION['email'])) {
        $response["error"] = "Lütfen giriş yapın";
        echo json_encode($response);
        exit;
    }

    // Formdan gelen veriyi al ve güvenlik için temizle
    $updated_name = isset($_POST['updated_name']) ? trim($_POST['updated_name']) : '';
    
    if (empty($updated_name)) {
        $response["error"] = "Güncellenen ad boş olamaz.";
        echo json_encode($response);
        exit;
    }

    $email = $_SESSION['email'];

    // Veritabanında güncelleme işlemi
    $query = "UPDATE users SET displayname = ? WHERE email = ?";
    $stmt = $conn->prepare($query);

    if ($stmt === false) {
        $response["error"] = "Veritabanı hatası.";
        echo json_encode($response);
        exit;
    }

    // Parametreleri bağla ve çalıştır
    $stmt->bind_param("ss", $updated_name, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Başarıyla güncellenmişse
        echo json_encode($response);
    } else {
        // Hiçbir şey güncellenmemişse
        $response["error"] = "Güncelleme işlemi başarısız oldu.";
        echo json_encode($response);
    }

    // Veritabanı bağlantısını kapat
    $stmt->close();
    $conn->close();
}
?>

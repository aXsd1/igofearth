<?php
// Hata mesajlarını aç (Sadece geliştirme ortamında)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Bağlantıyı dahil et
include("connection.php");

// JSON çıktısı döndürdüğümüzü belirtelim
header("Content-Type: application/json");

// POST verisini al
$data = json_decode(file_get_contents('php://input'), true);

// Veri kontrolü
if (!$data || empty($data['username']) || empty($data['lastname']) || empty($data['email']) || empty($data['password'])) {
    exit(json_encode(["error" => "Invalid input data"]));
}

// Verileri al
$username = trim($data['username']);
$lastname = trim($data['lastname']);
$email = trim($data['email']);
$password = $data['password'];

// Session başlat
session_start();
session_regenerate_id(true);
$_SESSION['user'] = $username;

// Tarih ve varsayılan profil fotoğrafı
$current_date = date('Y-m-d H:i:s');
$pic = "../user_pic/Screenshot_2.png";
$displayname = "";

// Email kontrolü
$sql = "SELECT id FROM users WHERE email = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$count_email = mysqli_num_rows($result);
mysqli_stmt_close($stmt);


if ($count_email > 0) {
    exit(json_encode(["error" => "Email already exists"]));
}

// Şifreyi hashle
$hash = password_hash($password, PASSWORD_DEFAULT);

// Yeni kullanıcıyı kaydet
$sql = "INSERT INTO users(displayname, name, lastname, email, password, user_pic, date) VALUES(?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sssssss", $displayname, $username, $lastname, $email, $hash, $pic, $current_date);

if (mysqli_stmt_execute($stmt)) {
    mysqli_stmt_close($stmt);
    exit(json_encode(["success" => true]));
} else {
    exit(json_encode(["error" => "Database error: " . mysqli_error($conn)]));
}
?>
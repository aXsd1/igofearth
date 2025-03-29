<?php
// Hata mesajlarını aç (Sadece geliştirme ortamında)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("connection.php");

// JSON çıktısı döndürdüğümüzü belirtelim
header("Content-Type: application/json");

// JSON verisini oku ve doğrula
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    exit(json_encode(["error" => "Invalid input data"]));
}

$email = trim($data['email']);
$password = $data['password'];

session_start();

// SQL sorgusu ve güvenli bağlama
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
if (!$stmt) {
    exit(json_encode(["error" => "Database error: " . $conn->error]));
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Kullanıcı bulundu, şifreyi kontrol et
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        $_SESSION['email'] = $row['email'];

        // JSON yanıt ile başarı bilgisi döndür
        exit(json_encode(["success" => true, 
                          "redirect" => "profile/"]));
    }
}

// Hatalı giriş
exit(json_encode(["error" => "Wrong e-mail or password"]));

// Bağlantıyı kapat
$stmt->close();
$conn->close();
?>

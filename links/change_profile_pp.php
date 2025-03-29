<?php
// Hata raporlamayı aç (geliştirme için)
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

include("connection.php");

$response = ["success" => false, "error" => ""];

// **Dosya Yükleme Kontrolü**
$target_dir = "../user_pic/";

if (!isset($_FILES["file"])) {
    $response["error"] = "No file uploaded.";
    echo json_encode($response);
    exit;
}

// Dosya Güvenlik Kontrolleri
$check = getimagesize($_FILES["file"]["tmp_name"]);
if ($check === false) {
    $response["error"] = "Only image files are allowed.";
    echo json_encode($response);
    exit;
}

$safe_name = uniqid() . ".jpg";
$target_file = $target_dir . $safe_name;

// **Dosya Yükleme**
if (!move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    $response["error"] = "Error uploading image.";
    echo json_encode($response);
    exit;
}

// **Resmi Dönüştür ve Boyutlandır**
$converted_file = $target_dir . 'picture_' . $safe_name;
convertAndResizeImage($target_file, $converted_file, 200, 200);

// **E-posta Kontrolü**
if (!isset($_POST["email"]) || empty($_POST["email"])) {
    $response["error"] = "User email is required.";
    echo json_encode($response);
    exit;
}

$email = $_POST["email"];

// **Veritabanını Güncelle (MySQLi ile)**
if ($stmt = $conn->prepare("UPDATE users SET user_pic = ? WHERE email = ?")) {
    $stmt->bind_param("ss", $converted_file, $email); // 'ss' her iki parametreyi de string olarak bağlar
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response["success"] = true;
    } else {
        $response["error"] = "No user found or no update needed.";
    }

    $stmt->close();
} else {
    $response["error"] = "Database error: " . $conn->error;
}

echo json_encode($response);
exit;

function convertAndResizeImage($file, $target_file, $max_width, $max_height) {
    list($original_width, $original_height, $image_type) = getimagesize($file);
    
    switch ($image_type) {
        case IMAGETYPE_JPEG:
            $src = imagecreatefromjpeg($file);
            break;
        case IMAGETYPE_PNG:
            $src = imagecreatefrompng($file);
            break;
        case IMAGETYPE_GIF:
            $src = imagecreatefromgif($file);
            break;
        default:
            die(json_encode(["success" => false, "error" => "Invalid image format!"]));
    }

    $resize_ratio = min($max_width / $original_width, $max_height / $original_height);
    $new_width = (int)($original_width * $resize_ratio);
    $new_height = (int)($original_height * $resize_ratio);
    
    $dst = imagecreatetruecolor($new_width, $new_height);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $original_width, $original_height);
    imagejpeg($dst, $target_file, 90);

    unlink($file); // Orijinal dosyayı sil

    imagedestroy($src);
    imagedestroy($dst);
}
?>

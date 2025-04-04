<?php
include("connection.php");
// MysQl log
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

session_start();

$user = $_SESSION['id'];

// jpeg + re-size
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
            die("Invalid image format!");
    }

    $resize_ratio = min($max_width / $original_width, $max_height / $original_height);
    $new_width = (int)($original_width * $resize_ratio);
    $new_height = (int)($original_height * $resize_ratio);
    
    $dst = imagecreatetruecolor($new_width, $new_height);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $original_width, $original_height);
    imagejpeg($dst, $target_file, 90);

    // delete original file
    unlink($file);

    //freed any memory associated with the image resource
    imagedestroy($src);
    imagedestroy($dst);
}


$latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : 0;
$longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : 0;
$info = isset($_POST['info']) ? htmlspecialchars($_POST['info']) : "";

// Create table name
$table_name = ($latitude < 0 ? "s" : "n") . abs(floor($latitude)) . "_" . ($longitude < 0 ? "w" : "e") . abs(floor($longitude));

// File
$target_dir = "../uploads/";

if (!isset($_FILES["file"])) {
    die("Dosya yüklenmedi!");
}

// Secure file
$safe_name = uniqid() . ".jpg";
$target_file = $target_dir . $safe_name;

// Check file
$check = getimagesize($_FILES["file"]["tmp_name"]);
if ($check === false) {
    die("Only pictures are accepted");
}

// Upload
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    $converted_file = $target_dir . 'picture_' . $safe_name;
    convertAndResizeImage($target_file, $converted_file, 600, 600);
} else {
    die("Error uploading image.");
}

// Tabloyu kontrol et ve oluştur
$conn->query("CREATE TABLE IF NOT EXISTS `$table_name` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    info TEXT,
    pic TEXT,
    user_id TEXT
)");

// Veriyi tabloya ekle
$insertQuery = $conn->prepare("INSERT INTO `$table_name` (latitude, longitude, info, pic, user_id) VALUES (?, ?, ?, ?, ?)");
$insertQuery->bind_param("ddsss", $latitude, $longitude, $info, $converted_file, $user);
$insertQuery->execute();

$stmt = $conn->prepare("UPDATE users SET xp = xp + 10 WHERE id = ?");
$stmt->bind_param("i", $user);
$stmt->execute();

// Bağlantıyı kapat
$insertQuery->close();
$conn->close();

echo "Succes!";
?>
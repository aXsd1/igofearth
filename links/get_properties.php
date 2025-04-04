<?php
// Hata raporlamayı aç (geliştirme aşamasında kullan)
error_reporting(E_ALL);
ini_set('display_errors', 1);


// Veritabanı bağlantısını ekle
include("connection.php");

// Latitude ve Longitude kontrolü
$latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : 0;
$longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : 0;

// Dinamik tablo adı oluştur (örnek: "n34_w118")
$table_name = ($latitude < 0 ? "s" : "n") . abs(floor($latitude)) . "_" . ($longitude < 0 ? "w" : "e") . abs(floor($longitude));

// Validate the table name to prevent SQL injection (although the approach you're using is relatively safe)
$table_name = mysqli_real_escape_string($conn, $table_name);


$query = "
    SELECT t.*, u.id AS user_id, u.name, u.lastname, u.email, u.user_pic, u.displayname
    FROM `$table_name` t
    INNER JOIN users u ON t.user_id = u.id
";
$result = $conn->query($query);

// Hata kontrolü
if ($result === false) {
    echo json_encode(['error' => 'Veritabanı sorgusu hatalı']);
    exit;
}

// Sonuçları JSON formatında döndür
$properties = [];
while ($row = $result->fetch_assoc()) {
    $properties[] = $row;
}

header('Content-Type: application/json'); // JSON çıktısı döndürüyoruz
echo json_encode($properties);

// Veritabanı bağlantısını kapat
$conn->close();
?>

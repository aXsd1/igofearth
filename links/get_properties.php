<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
include("connection.php");

// Get the latitude, longitude, and info from the POST request
$latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : 0;
$longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : 0;


// Create the table name based on latitude and longitude
$table_name = ($latitude < 0 ? "s" : "n") . abs(floor($latitude)) . "_" . ($longitude < 0 ? "w" : "e") . abs(floor($longitude));

// Validate the table name to prevent SQL injection (although the approach you're using is relatively safe)
$table_name = mysqli_real_escape_string($conn, $table_name);

// Prepare the SQL query
$query = "SELECT * FROM `$table_name`";

// Execute the query
$result = $conn->query($query);

// Check for errors in query execution
if ($result === false) {
    echo json_encode(['error' => 'Veritabanı sorgusu hatalı']);
    exit;
}

// Fetch the properties and store them in an array
$properties = [];
while ($row = $result->fetch_assoc()) {
    $properties[] = $row;
}

// Set the Content-Type to application/json
header('Content-Type: application/json');

// Return the properties as a JSON response
echo json_encode($properties);

// Close the database connection
$conn->close();
?>

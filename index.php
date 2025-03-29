<?php
include("links/connection.php");
session_start();

$logged_in = isset($_SESSION['email']);
$displayname = $name = $lastname = $user_pic = "";
$email = $logged_in ? $_SESSION['email'] : "";

if ($logged_in) {
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $displayname = htmlspecialchars($row['displayname']);
        $name = htmlspecialchars($row['name']);
        $lastname = htmlspecialchars($row['lastname']);
        $user_pic = htmlspecialchars($row['user_pic']);
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <link rel="stylesheet" href="assets\css\index.css">
</head>
<body>
    <div class="header">
        <ul>
            <div>
                <div class="dropdown">
                    <button onclick="myFunction(1)" class="dropbtn">Profile</button>
                    <div id="myDropdown1" class="dropdown-content">
                        <?php if ($logged_in): ?>
                            <div class="profile">
                                <img src="./user_pic/<?php echo $user_pic; ?>" alt="Profile Picture">
                                <h3><?php echo $displayname; ?></h3>
                            </div>
                            <div class="profile_details">
                                <h4>Name: <?php echo $name; ?></h4>
                                <h4>Lastname: <?php echo $lastname; ?></h4>
                                <h4>Email: <?php echo $email; ?></h4>
                                <h4>Total messages: 500</h4>
                            </div>
                        <?php else: ?>
                            <p style="text-align: center; padding: 10px; font-weight: bold;">Lütfen giriş yapın</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <div>
                <div class="dropdown">
                  <button onclick="myFunction(2)" class="dropbtn">Settings</button>
                  <div id="myDropdown2" class="dropdown-content">
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                  </div>
                </div>
            </div>
            <div>button</div>
            <div>Login</div>
        </ul>
    </div>
    <div id="map"></div>
    <div>
        <?php if ($logged_in): ?>
            <button class="btn" id="commentbtn">Comment!</button>
        <?php else: ?>
            <button class="btn" id="commentbtn">Login in to make a comment</button>
        <?php endif; ?>
    </div>
                
    <!-- Modal ve Overlay -->
    <div onclick="closeModal()" class="overlay" id="overlay"></div>
    <div class="modal" id="modal"></div>
    
    <script src="assets\js\index.js"></script>
    <script src="assets\js\web_functions.js"></script>
</body>
</html>
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
            <div><i class="fa-solid fa-tags"></i><li><a data-scroll href="#infobox">About us</a></li></div>
            <div><i class="fa-solid fa-question"></i><li><a data-scroll href="#qnain">Map</a></li></div>
            <div><i class="fa-solid fa-address-book"></i><li><a data-scroll href="#contact">Contact us</a></li></div>
            <div><i class="fa-solid fa-user"></i><a href="http://yeageth.com/login.php" target="_blank" rel="noopener noreferrer" class="user-link">Login</a></div>
        </ul>
    </div>
    <div id="map"></div>
    
    <button class="btn" id="commentbtn">Comment!</button>

    <!-- Modal ve Overlay -->
    <div onclick="closeModal()" class="overlay" id="overlay"></div>
    <div class="modal" id="modal"></div>
    
    <script src="assets\js\index.js"></script>
    <script src="assets\js\web_functions.js"></script>
</body>
</html>
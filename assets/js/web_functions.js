let isModalOpen = false;
function openModal() {
    isModalOpen = true;
    // Modal
    var modalContent = `
    <form class="form" onsubmit="return false;">
        <span class="signup">Take a photo and leave a comment</span>
        <div
          <div class="file-upload-container">
            <div class="file-upload">
              <input name="file" multiple="" class="file-input" id="fileInput" type="file" />
              <label class="file-label" for="fileInput">
                <i class="upload-icon">📁</i>
                <p>Drag &amp; Drop your files here or click to upload</p>
              </label>
            </div>
          </div>
          <div class="message">
              <input id="filed1" type="text" name="filed1" placeholder="What makes this place special" class="form--input">
            <div class="progress-container">
              <svg width="50" height="50" class="progress-ring">
                <circle cx="25" cy="25" r="20" stroke="#ddd" stroke-width="5" fill="none"/>
                <circle id="progressCircle" cx="25" cy="25" r="20" stroke="#1DA1F2" stroke-width="5" fill="none"
                stroke-dasharray="126" stroke-dashoffset="126"/>
              </svg>
              <div class="progress-text" id="charCount">0</div>
            </div>
          </div>
        </div>

        <button class="btn" onclick="Marker();">Send</button>
    </form>
    `;
    document.getElementById('modal').innerHTML = modalContent;

    // Overlay ve modalı show
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';

    const textarea = document.getElementById("filed1");
    const progressCircle = document.getElementById("progressCircle");
    const charCount = document.getElementById("charCount");

    const maxChars = 280;
    const circleLength = 126; // SVG çemberin çevresi

    textarea.addEventListener("input", function () {
        let currentLength = textarea.value.length;
    
        // Karakter sayısını göster
        charCount.textContent = currentLength;
    
        // Çemberin doluluk oranını ayarla
        let progress = (currentLength / maxChars) * circleLength;
        progressCircle.style.strokeDashoffset = circleLength - progress;
    
        // 280 karakteri geçtiğinde yazmayı engelle
        if (currentLength >= maxChars) {
            textarea.value = textarea.value.substring(0, maxChars);
        }
    });

}

function openEdit_picture_Modal() {
  isModalOpen = true;
  // Modal
  var modalContent = `
  <form class="form" onsubmit="return false;">
      <div class="file-upload-container">
        <div class="file-upload">
          <input name="profile_pp_file" multiple="" class="file-input" id="fileInput" type="file" />
          <label class="file-label" for="fileInput">
            <i class="upload-icon">📁</i>
            <p>Drag &amp; Drop your files here or click to upload</p>
          </label>
        </div>
      </div>
      <p id="message" class="sign-up-label"></p>
      <button class="btn" onclick="Edit_picture();">Send</button>
  </form>
  `;
  document.getElementById('modal').innerHTML = modalContent;

  // Overlay ve modalı show
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('modal').style.display = 'block';

}

function closeModal() {
    isModalOpen = false;
    // Overlay ve modalı hide
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
}

// Create marker
function Marker() {
  let center = map.getCenter(); // Center of map
  const comment1 = document.querySelector('[name="filed1"]').value;
  const fileInput = document.querySelector('[name="file"]'); // File inputu

  saveLocation(center.lat(), center.lng(), comment1, fileInput.files[0]);
}

function saveLocation(lat, lon, info, file) {
  const formData = new FormData();
  formData.append("latitude", lat);
  formData.append("longitude", lon);
  formData.append("info", info);
  formData.append("file", file);

  fetch("./links/save_location.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
}

commentbtn = document.querySelector("#commentbtn");
commentbtn.addEventListener("click", () => {
  openModal();
});

/* dropdown */
function myFunction(number) {
  document.getElementById("myDropdown" + number).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function Edit_picture() {
  /* var userEmail = "<?php echo $email; ?>"; */
  var userEmail = "support@yeageth.com";
  const fileInput = document.querySelector('[name="profile_pp_file"]');
  const errorMessageDiv = document.getElementById('message');

  if (!fileInput || !fileInput.files.length) {
    errorMessageDiv.innerText = "Please upload a picture first";
    errorMessageDiv.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("email", userEmail);

  fetch("./links/change_profile_pp.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      errorMessageDiv.innerText = "Picture changed successfully!";
      errorMessageDiv.style.color = "green";
      setTimeout(function() {
        location.reload();
      }, 1500);
    } else {
      errorMessageDiv.innerText = data.error || "An unknown error has occurred";
      errorMessageDiv.style.color = "red";
    }
  })
  .catch(error => {
    errorMessageDiv.innerText = 'Error: ' + error.message;
    errorMessageDiv.style.color = "red";
    console.error('An error occurred:', error);
  });
}

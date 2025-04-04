let isModalOpen = false;
function openModal() {
    isModalOpen = true;

    // Modal içeriği
    var modalContent = `
    <form class="form" onsubmit="return false;">
        <span class="signup">Take a photo and leave a comment</span>
        <div class="file-upload-container">
            <div class="file-upload">
                <input name="file" class="file-input" id="fileInput" type="file" />
                <label class="file-label" for="fileInput">
                    <i class="upload-icon" id="uploadIcon">📁</i>
                    <p id="uploadText">Drag & Drop your files here or click to upload</p>
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

        <button class="btn" onclick="Marker();">Send</button>
    </form>`;

    // Modal içine HTML içeriğini ekle
    document.getElementById('modal').innerHTML = modalContent;

    // Overlay ve modalı göster
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';

    // Elemanları seç
    const textarea = document.getElementById("filed1");
    const progressCircle = document.getElementById("progressCircle");
    const charCount = document.getElementById("charCount");
    const uploadText = document.getElementById("uploadText");
    const uploadIcon = document.getElementById("uploadIcon");
    const fileInput = document.getElementById("fileInput");

    const maxChars = 280;
    const circleLength = 126; // SVG çemberin çevresi

    // Karakter sayacı ve ilerleme çemberi
    textarea.addEventListener("input", function () {
        let currentLength = textarea.value.length;
    
        // Karakter sayısını güncelle
        charCount.textContent = currentLength;
    
        // Çemberin doluluk oranını ayarla
        let progress = (currentLength / maxChars) * circleLength;
        progressCircle.style.strokeDashoffset = circleLength - progress;
    
        // 280 karakteri geçtiğinde giriş engellenir
        if (currentLength >= maxChars) {
            textarea.value = textarea.value.substring(0, maxChars);
            charCount.textContent = maxChars; // Sayacı 280'de sabitle
        }
    });

    // Dosya yükleme işlemi
    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            uploadIcon.innerHTML = "✅"; // Tik işareti koy
            uploadText.innerHTML = "File uploaded successfully!";
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
          <input name="profile_pp_file" class="file-input" id="fileInput" type="file" />
          <label class="file-label" for="fileInput">
            <i class="upload-icon" id="uploadIcon">📁</i>
            <p id="uploadText">Drag & Drop your files here or click to upload</p>
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

  const fileInput = document.getElementById("fileInput");
  const uploadText = document.getElementById("uploadText");
  const uploadIcon = document.getElementById("uploadIcon");

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        uploadIcon.innerHTML = "✅"; // Tik işareti koy
        uploadText.innerHTML = "File uploaded successfully!";
    }
  });
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
if (commentbtn) {
  commentbtn.addEventListener("click", () => {
    openModal();
  });
}
  
/* dropdown */
function myFunction(number) {
  document.getElementById("myDropdown" + number).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content, .dropdown-content *')) {
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
  const fileInput = document.querySelector('[name="profile_pp_file"]');
  const errorMessageDiv = document.getElementById('message');

  if (!fileInput || !fileInput.files.length) {
    errorMessageDiv.style.display = "block";
    errorMessageDiv.innerText = "Please upload a picture first";
    errorMessageDiv.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("./links/change_profile_pp.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      errorMessageDiv.style.display = "block";
      errorMessageDiv.innerText = "Picture changed successfully!";
      errorMessageDiv.style.color = "green";
      setTimeout(function() {
        errorMessageDiv.style.display = "none";
        location.reload();
      }, 1500);
    } else {
      errorMessageDiv.style.display = "block";
      errorMessageDiv.innerText = data.error || "An unknown error has occurred";
      errorMessageDiv.style.color = "red";
    }
  })
  .catch(error => {
    errorMessageDiv.style.display = "block";
    errorMessageDiv.innerText = 'Error: ' + error.message;
    errorMessageDiv.style.color = "red";
    console.error('An error occurred:', error);
  });
}

//profile editing
const nameDisplay = document.getElementById('nameDisplay');
const editIcon = document.getElementById('editIcon');
const nameText = document.getElementById('nameText');
const nameInput = document.getElementById('nameInput');

if (nameDisplay, editIcon, nameText, nameInput) {

  // Mouse hover to show the edit icon
  nameDisplay.addEventListener('mouseenter', function () {
    editIcon.style.display = 'inline'; // Show edit icon
  });
  
  nameDisplay.addEventListener('mouseleave', function () {
    editIcon.style.display = 'none'; // Hide edit icon
  });
  
  // Click the edit icon to make the name editable
  editIcon.addEventListener('click', function () {
    nameText.style.display = 'none'; // Hide the current name text
    nameInput.style.display = 'inline'; // Show input field
    nameInput.focus(); // Focus on the input field
  });
  
  // Optional: Update the name when the input loses focus (blur event)
  nameInput.addEventListener('blur', function () {
    const updatedName = nameInput.value;
    const errorMessageDiv = document.getElementById('message');
    nameText.textContent = updatedName; // Update displayed name
    nameText.style.display = 'inline'; // Show updated name text
    nameInput.style.display = 'none'; // Hide input field
    
    const formData = new FormData();
    
    formData.append("updated_name", updatedName);
    
    fetch("./links/update_display_name.php", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.success) {
      errorMessageDiv.style.display = "block";
      errorMessageDiv.innerText = "Display name changed successfully!";
      errorMessageDiv.style.color = "green";
      setTimeout(function() {
        errorMessageDiv.style.display = "none";
        /* location.reload(); */
      }, 1500);
    } else {
      errorMessageDiv.style.display = "block";
      errorMessageDiv.innerText = data.error || "An unknown error has occurred";
      errorMessageDiv.style.color = "red";
    }
  })
  .catch(error => {
    errorMessageDiv.style.display = "block";
    errorMessageDiv.innerText = 'Error: ' + error.message;
    errorMessageDiv.style.color = "red";
    console.error('An error occurred:', error);
  });
});

// Optional: Allow "Enter" key to also save the edited name
nameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    nameInput.blur(); // Trigger blur to save the value
  }
});
}

function logout() {
  window.location.href = "links/logout.php"
}
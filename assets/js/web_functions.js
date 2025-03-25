let isModalOpen = false;
function openModal() {
    isModalOpen = true;
    // Modal
    var modalContent = `
    <form class="form">
        <span class="signup">Mate a comment to /</span>
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
          <input id="filed1" type="text" name="filed1" placeholder="What makes this place special" class="form--input">
        </div>

        <button class="form--submit" onclick="Marker();">Send</button>
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
  

(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "",
    v: "weekly"
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

let map;

const chicago = { lat: 37.50024109655184, lng: -122.28528451834352 };

// find me button
function createCenterControl(map) {
    const controlButton = document.createElement("button");
  
    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    controlButton.style.border = "2px solid #fff";
    controlButton.style.borderRadius = "3px";
    controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "16px";
    controlButton.style.lineHeight = "38px";
    controlButton.style.margin = "8px 0 22px";
    controlButton.style.padding = "0 5px";
    controlButton.style.textAlign = "center";
    controlButton.textContent = "Pos";
    controlButton.title = "Click to recenter the map";
    controlButton.type = "button";
    
    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener("click", () => {
      map.setCenter(chicago);
    });
    return controlButton;
}
// Add marker button
function createMarkerButton() {
    const controlButton = document.createElement("button");
  
    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    controlButton.style.border = "2px solid #fff";
    controlButton.style.borderRadius = "3px";
    controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "16px";
    controlButton.style.lineHeight = "38px";
    controlButton.style.margin = "8px 0 22px";
    controlButton.style.padding = "0 5px";
    controlButton.style.textAlign = "center";
    controlButton.textContent = "Create marker";
    controlButton.title = "Click to Create marker";
    controlButton.type = "button";
    
    return controlButton;
}


async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    disableDefaultUI: true,
    mapId: '64925beabcd5a359',
  });


  // Only show each marker above a certain zoom level. -test
  /* map.addListener("zoom_changed", () => {
    const zoom = map.getZoom();

    if (zoom) {
      
      marker01.map = zoom > 14 ? map : null;
      marker02.map = zoom > 15 ? map : null;
      marker03.map = zoom > 16 ? map : null;
      marker04.map = zoom > 17 ? map : null;
    }
  }); */


  // Create the DIV to hold the control.
  //const centerControlDiv = document.createElement("div");
  //const centerControl = createCenterControl(map);
  //centerControlDiv.appendChild(centerControl);
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
//
//
  //// Create add marker button
  //const createMarkerDiv = document.createElement("div");
  //const createMarker = createMarkerButton();
  //createMarkerDiv.appendChild(createMarker);
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(createMarkerDiv);
  //
  //createMarker.addEventListener("click", () => {
  //  //Marker();
  //  openModal();
  //});
  google.maps.event.addListener(map, 'dragend', function() {
    loadVisibleProperties();
  });
  
}

// open html markers
function toggleHighlight(markerView, property) {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
}
markers = [];

function loadVisibleProperties() {
  let center = map.getCenter();
  const formData = new FormData();
  formData.append("latitude", center.lat());
  formData.append("longitude", center.lng());

  fetch("./links/get_properties.php", {
    method: "POST",
    body: formData
  })
  .then(response => (response.json()))
  .then(properties => {
    console.log(properties);
    // Clear existing markers before adding new ones
    markers.forEach(marker => {
      marker.setMap(null); // Remove the marker from the map
    });
    markers = []; // Clear the markers array
  
    // Loop through each property and create a new marker
    properties.forEach(property => {
      const position = new google.maps.LatLng(property.latitude, property.longitude); // Create a LatLng object
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: buildContent(property), // Customize the content as needed
        position: position, // Use the LatLng object for position
        title: property.description // Assuming the description exists in the property object
      });
  
      // Add the new marker to the markers array for later removal
      markers.push(marker);
  
      // Add click event listener to toggle highlight on the marker
      marker.addListener("click", () => {
        toggleHighlight(marker, property);
      });
    });
  })
  
  .catch(error => console.error("Error:", error));
}


function buildContent(property) {
  const content = document.createElement("div");

  content.classList.add("property");
  content.innerHTML = `
      <div class="icon">
        <img src="./uploads/${property.pic}" alt="Property Image">
      </div>
      <div class="details">
        <div class="text_area">
          <h4>${property.info}</h4>
        </div>
        <div class="user">
          <img src="./uploads/${property.user_pic}" alt="" srcset="">
          <h3>${property.displayname}</h3>
        </div>
      </div>
    `;
  return content;
}




initMap();
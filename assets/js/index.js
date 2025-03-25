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

  // add html markers -test
  for (const property of properties) {
    const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      map,
      content: buildContent(property),
      position: property.position,
      title: property.description,
    });

    AdvancedMarkerElement.addListener("click", () => {
      toggleHighlight(AdvancedMarkerElement, property);
    });
  }

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
  const centerControlDiv = document.createElement("div");
  const centerControl = createCenterControl(map);
  centerControlDiv.appendChild(centerControl);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


  // Create add marker button
  const createMarkerDiv = document.createElement("div");
  const createMarker = createMarkerButton();
  createMarkerDiv.appendChild(createMarker);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(createMarkerDiv);
  
  createMarker.addEventListener("click", () => {
    //Marker();
    openModal();
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

//build html markers
function buildContent(property) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
          <span class="fa-sr-only">${property.type}</span>
      </div>
      <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${property.bed}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${property.bath}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${property.size} ft<sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
}

function saveLocation(lat, lon, info) {
  const formData = new FormData();
  formData.append("latitude", lat);
  formData.append("longitude", lon);
  formData.append("info", info);

  fetch("./links/save_location.php", {
      method: "POST",
      body: formData
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error("Hata:", error));
}

// list
const properties = [
    {
      address: "215 Emily St, MountainView, CA",
      description: "Single family house with modern design",
      price: "$ 3,889,000",
      type: "house",
      bed: 5,
      bath: 4.5,
      size: 300,
      position: {
        lat: 37.50024109655184,
        lng: -122.28528451834352,
      },
    },
    {
      address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
      description: "Townhouse with friendly neighbors",
      price: "$ 3,050,000",
      type: "building",
      bed: 4,
      bath: 3,
      size: 200,
      position: {
        lat: 37.44440882321596,
        lng: -122.2160620727,
      },
    },
    {
      address: "100 Chris St, Portola Valley, CA",
      description: "Spacious warehouse great for small business",
      price: "$ 3,125,000",
      type: "warehouse",
      bed: 4,
      bath: 4,
      size: 800,
      position: {
        lat: 37.39561833718522,
        lng: -122.21855116258479,
      },
    },
    {
      address: "98 Aleh Ave, Palo Alto, CA",
      description: "A lovely store on busy road",
      price: "$ 4,225,000",
      type: "shop",
      bed: 2,
      bath: 1,
      size: 210,
      position: {
        lat: 37.423928529779644,
        lng: -122.1087629822001,
      },
    },
    {
      address: "2117 Su St, MountainView, CA",
      description: "Single family house near golf club",
      price: "$ 1,700,000",
      type: "house",
      bed: 4,
      bath: 3,
      size: 200,
      position: {
        lat: 37.40578635332598,
        lng: -122.15043378466069,
      },
    },
    {
      address: "197 Alicia Dr, Santa Clara, CA",
      description: "Multifloor large warehouse",
      price: "$ 5,000,000",
      type: "warehouse",
      bed: 5,
      bath: 4,
      size: 700,
      position: {
        lat: 37.36399747905774,
        lng: -122.10465384268522,
      },
    },
    {
      address: "700 Jose Ave, Sunnyvale, CA",
      description: "3 storey townhouse with 2 car garage",
      price: "$ 3,850,000",
      type: "building",
      bed: 4,
      bath: 4,
      size: 600,
      position: {
        lat: 37.38343706184458,
        lng: -122.02340436985183,
      },
    },
    {
      address: "868 Will Ct, Cupertino, CA",
      description: "Single family house in great school zone",
      price: "$ 2,500,000",
      type: "house",
      bed: 3,
      bath: 2,
      size: 100,
      position: {
        lat: 37.34576403052,
        lng: -122.04455090047453,
      },
    },
    {
      address: "655 Haylee St, Santa Clara, CA",
      description: "2 storey store with large storage room",
      price: "$ 2,500,000",
      type: "shop",
      bed: 3,
      bath: 2,
      size: 450,
      position: {
        lat: 37.362863347890716,
        lng: -121.97802139023555,
      },
    },
    {
      address: "2019 Natasha Dr, San Jose, CA",
      description: "Single family house",
      price: "$ 2,325,000",
      type: "house",
      bed: 4,
      bath: 3.5,
      size: 500,
      position: {
        lat: 37.41391636421949,
        lng: -121.94592071575907,
      },
    },
  ];



initMap();

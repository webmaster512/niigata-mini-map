
const mapElement = document.getElementById("map");
const mapSection = document.getElementById("mapSection");
const startButton = document.getElementById("startButton");
const mapTabs = document.querySelectorAll(".map-tab");

let currentMapName = "full";
let map;
let imageOverlay;
let mapBounds;

function showMap(mapName) {
  const config = MAP_CONFIG[mapName];

  currentMapName = mapName;

  mapTabs.forEach((tab) => {
    const isActive = tab.dataset.map === mapName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  if (imageOverlay) {
    map.removeLayer(imageOverlay);
  }

  const image = new Image();

  image.onload = () => {
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    mapBounds = [
      [0, 0],
      [imageHeight, imageWidth]
    ];

    imageOverlay = L.imageOverlay(config.image, mapBounds);
    imageOverlay.addTo(map);

    map.setMaxBounds(mapBounds);
    map.fitBounds(mapBounds);

    map.setMinZoom(map.getBoundsZoom(mapBounds));
    map.setZoom(map.getBoundsZoom(mapBounds));
  };

  image.onerror = () => {
    alert(
      "地図画像を読み込めませんでした。\n" +
      "画像の場所とファイル名を確認してください。\n\n" +
      config.image
    );
  };

  image.src = config.image;
}

function initializeMap() {
  if (map) {
    map.invalidateSize();
    return;
  }

  map = L.map("map", {
    crs: L.CRS.Simple,
    zoomControl: false,
    attributionControl: false,
    minZoom: -3,
    maxZoom: 2,
    zoomSnap: 0.25,
    zoomDelta: 0.5
  });

  showMap(currentMapName);
}

startButton.addEventListener("click", () => {
  document.querySelector(".intro").hidden = true;
  mapSection.hidden = false;

  initializeMap();

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});

mapTabs.forEach((tab) => {
  tab.setAttribute("aria-pressed", String(tab.classList.contains("active")));

  tab.addEventListener("click", () => {
    showMap(tab.dataset.map);
  });
});

document.getElementById("zoomIn").addEventListener("click", () => {
  if (map) {
    map.zoomIn();
  }
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (map) {
    map.zoomOut();
  }
});

document.getElementById("resetMap").addEventListener("click", () => {
  if (map && mapBounds) {
    map.fitBounds(mapBounds);
  }
});

document.getElementById("fullscreenButton").addEventListener("click", async () => {
  const mapElement = document.getElementById("map");

  try {
    if (!document.fullscreenElement) {
      await mapElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }

    setTimeout(() => {
      if (map) {
        map.invalidateSize();
        if (mapBounds) {
          map.fitBounds(mapBounds);
        }
      }
    }, 200);
  } catch (error) {
    alert("全画面表示にできませんでした。ブラウザーの設定をご確認ください。");
  }
});

document.addEventListener("fullscreenchange", () => {
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 200);
});

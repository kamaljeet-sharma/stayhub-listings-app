console.log("MAP FILE LOADED");

const mapDiv = document.getElementById("map");

if (mapDiv) {

    const lat = parseFloat(mapDiv.dataset.lat);
    const lng = parseFloat(mapDiv.dataset.lng);
    const title = mapDiv.dataset.title;

    console.log(lat, lng);

    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors",
        }
    ).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(title)
        .openPopup();
}
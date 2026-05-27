if (typeof coordinates !== "undefined") {

    const map = L.map('map').setView(
        [coordinates[0], coordinates[1]],
        13
    );

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    L.marker([coordinates[0], coordinates[1]])
        .addTo(map)
        .bindPopup(listingTitle)
        .openPopup();
}
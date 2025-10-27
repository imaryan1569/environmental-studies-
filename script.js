// Initialize the map
var map = L.map('map').setView([12.9716, 77.5946], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add main lakes
var lakes = [
  { name: 'Bellandur Lake', coords: [12.9352,77.6643], desc: 'Foam & pollution from sewage and runoff.' },
  { name: 'Varthur Lake', coords: [12.9279,77.7136], desc: 'Polluted sections and solid waste.' },
  { name: 'Ulsoor Lake', coords: [12.9784,77.6268], desc: 'Urban pressure and littering.' },
  { name: 'Kaikondrahalli Lake', coords: [12.9358,77.6766], desc: 'Restored via community action.' }
];

lakes.forEach(function(lake) {
  L.marker(lake.coords).addTo(map)
    .bindPopup('<strong>' + lake.name + '</strong><br>' + lake.desc);
});

// Generate a unique complaint ID
function genId() {
  return 'NR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Save report to localStorage
function saveReport(report) {
  var all = JSON.parse(localStorage.getItem('nn_reports') || '[]');
  all.unshift(report);
  localStorage.setItem('nn_reports', JSON.stringify(all));
}

// Render cleaned reports
function renderCleaned() {
  var all = JSON.parse(localStorage.getItem('nn_reports') || '[]');
  var gallery = document.getElementById('cleaned-gallery');
  gallery.innerHTML = '';
  all.filter(r => r.status === 'cleaned').forEach(function(r) {
    var div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${r.afterPhoto || r.photo}" alt="Cleaned Area">
      <h3>${r.location}</h3>
      <p>Cleaned on: ${r.cleanedAt || 'N/A'}</p>
    `;
    gallery.appendChild(div);
  });
}

// Handle form submission
document.getElementById('report-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var name = document.getElementById('r-name').value.trim();
  var mobile = document.getElementById('r-mobile').value.trim();
  var location = document.getElementById('r-location').value.trim();
  var desc = document.getElementById('r-desc').value.trim();
  var fileEl = document.getElementById('r-photo');

  if (!location || !desc || fileEl.files.length === 0) {
    alert('Please fill in all required fields and upload a photo.');
    return;
  }

  var file = fileEl.files[0];
  var reader = new FileReader();
  reader.onload = function(evt) {
    var id = genId();
    var report = {
      id: id,
      name: name || 'Anonymous',
      mobile: mobile || '',
      location: location,
      desc: desc,
      photo: evt.target.result,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveReport(report);
    document.getElementById('report-result').textContent =
      '✅ Report submitted successfully! Complaint ID: ' + id + ' (Demo only)';
    document.getElementById('report-form').reset();
    renderCleaned();
  };
  reader.readAsDataURL(file);
});

// Initial render
renderCleaned();

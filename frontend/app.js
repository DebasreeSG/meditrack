// ============================================
// FIREBASE CONFIG
// ============================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, push }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEhSvsM5cRiplMLLtsdOPlMJ0Ej6aRJUM",
  authDomain: "meditrack-15b7b.firebaseapp.com",
  databaseURL: "https://meditrack-15b7b-default-rtdb.firebaseio.com",
  projectId: "meditrack-15b7b",
  storageBucket: "meditrack-15b7b.firebasestorage.app",
  messagingSenderId: "1072957701503",
  appId: "1:1072957701503:web:fe7207fe28a8f21c7cae4a",
  measurementId: "G-85194RHMGX"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// ============================================
// GEMINI API KEY
// ============================================

const GEMINI_API_KEY = "AIzaSyCf0iTuhTWlgVbwZW59-0USwDUd6jCh3No";

// ============================================
// STATE
// ============================================

let allBloodBanks = {};
let allDonors = {};
let activeFilter = "";
let map = null;

// ============================================
// REAL-TIME FIREBASE LISTENERS
// ============================================

function listenToBloodBanks() {
  const banksRef = ref(database, "/bloodbanks");
  onValue(banksRef, (snapshot) => {
    allBloodBanks = snapshot.val() || {};
    renderBloodBanks(activeFilter);
    if (map) updateMapMarkers();
  });
}

function listenToDonors() {
  const donorsRef = ref(database, "/donors");
  onValue(donorsRef, (snapshot) => {
    allDonors = snapshot.val() || {};
    renderDonors(activeFilter);
  });
}

// ============================================
// RENDER BLOOD BANK CARDS
// ============================================

function renderBloodBanks(filter = "") {
  const container = document.getElementById("blood-cards");
  container.innerHTML = "";

  const banks = Object.entries(allBloodBanks);

  if (banks.length === 0) {
    container.innerHTML = `
      <p style="color:#666">
        Loading blood banks...
      </p>`;
    return;
  }

  let found = false;

  banks.forEach(([id, bank]) => {
    if (filter && bank.stock[filter] === 0) return;
    found = true;

    const stockHTML = Object.entries(bank.stock)
      .map(([type, count]) => `
        <span class="blood-badge"
          style="background:${count > 0 ? '#e63946' : '#ccc'}">
          ${type}: ${count > 0 ? count + " units" : "None"}
        </span>
      `).join("");

    container.innerHTML += `
      <div class="card">
        <h3>🏥 ${bank.name}</h3>
        <p>📍 ${bank.address}</p>
        <br/>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
          ${stockHTML}
        </div>
        <button class="call-btn"
          onclick="callNow('${bank.phone}')">
          📞 Call Now — ${bank.phone}
        </button>
        <button class="call-btn"
          style="background:#3498db;margin-top:8px"
          onclick="getDirections(${bank.lat}, ${bank.lng})">
          📍 Get Directions
        </button>
      </div>
    `;
  });

  if (!found) {
    container.innerHTML = `
      <p style="color:#666;font-size:16px">
        No blood banks found with available
        ${filter} blood nearby.
      </p>`;
  }
}

// ============================================
// RENDER DONOR CARDS
// ============================================

function renderDonors(filter = "") {
  const container = document.getElementById("donor-cards");
  container.innerHTML = "";

  const donors = Object.entries(allDonors);

  if (donors.length === 0) {
    container.innerHTML = `
      <p style="color:#666">
        Loading donors...
      </p>`;
    return;
  }

  let found = false;

  donors.forEach(([id, donor]) => {
    if (filter && donor.bloodType !== filter) return;
    found = true;

    container.innerHTML += `
      <div class="card">
        <h3>🧑‍🤝‍🧑 ${donor.name}</h3>
        <span class="blood-badge">${donor.bloodType}</span>
        <p>📍 ${donor.location}</p>
        <p>🕐 Last donated: ${donor.lastDonated}</p>
        <p class="${donor.available ? 'available' : 'unavailable'}">
          ${donor.available ? '✅ Available' : '❌ Not Available'}
        </p>
        ${donor.available ? `
          <button class="call-btn"
            onclick="callNow('${donor.phone}')">
            📞 Contact Donor
          </button>` : ""}
      </div>
    `;
  });

  if (!found) {
    container.innerHTML = `
      <p style="color:#666;font-size:16px">
        No donors found for blood type ${filter}.
      </p>`;
  }
}

// ============================================
// LEAFLET MAP
// ============================================

function initMap() {
  map = L.map("map-container").setView(
    [22.5726, 88.3639], 12
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap contributors" }
  ).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        })
      })
      .addTo(map)
      .bindPopup("📍 You are here")
      .openPopup();
      map.setView([latitude, longitude], 13);
    });
  }

  updateMapMarkers();
}

function updateMapMarkers() {
  if (!map) return;

  const redIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  Object.values(allBloodBanks).forEach(bank => {
    L.marker([bank.lat, bank.lng], { icon: redIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:Inter,sans-serif">
          <strong>🏥 ${bank.name}</strong><br/>
          📍 ${bank.address}<br/>
          <a href="tel:${bank.phone}"
            style="color:#e63946;font-weight:600">
            📞 ${bank.phone}
          </a>
        </div>
      `);
  });
}

// ============================================
// SEARCH
// ============================================

window.searchNearby = function () {
  activeFilter = document.getElementById("blood-type").value;
  renderBloodBanks(activeFilter);
  renderDonors(activeFilter);
  document.getElementById("blood")
    .scrollIntoView({ behavior: "smooth" });
}

// ============================================
// ONE CLICK CALL
// ============================================

window.callNow = function (phone) {
  window.location.href = `tel:${phone}`;
}

// ============================================
// GPS DIRECTIONS
// ============================================

window.getDirections = function (lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    "_blank"
  );
}

// ============================================
// DONOR REGISTRATION
// ============================================

window.showRegister = function () {
  document.getElementById("modal").classList.add("active");
}

window.closeRegister = function () {
  document.getElementById("modal").classList.remove("active");
}

window.registerDonor = async function () {
  const name = document.getElementById("donor-name").value.trim();
  const phone = document.getElementById("donor-phone").value.trim();
  const blood = document.getElementById("donor-blood").value;

  if (!name || !phone || !blood) {
    alert("Please fill all fields!");
    return;
  }

  const donorsRef = ref(database, "/donors");
  await push(donorsRef, {
    name,
    phone,
    bloodType: blood,
    location: "Kolkata",
    available: true,
    lastDonated: "Never"
  });

  alert(`✅ Thank you ${name}! Registered as ${blood} donor.`);
  closeRegister();
}

// ============================================
// GEMINI EMERGENCY ADVICE
// ============================================

window.getEmergencyAdvice = async function () {
  const blood = document.getElementById("blood-type").value || "O+";
  const btn = document.getElementById("emergency-btn");
  const box = document.getElementById("advice-box");

  btn.innerText = "Getting advice...";
  btn.disabled = true;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `There is a medical emergency. The patient urgently needs ${blood} blood in Kolkata. Give a short, clear action plan in 3 bullet points for what the family should do right now. Keep it simple, calm and practical.`
            }]
          }]
        })
      }
    );

    const data = await res.json();
    const advice = data.candidates[0].content.parts[0].text;

    box.innerHTML = `
      <div class="advice-card">
        <h3>🤖 AI Emergency Advice</h3>
        <p>${advice.replace(/\n/g, "<br/>")}</p>
      </div>`;

  } catch (err) {
    box.innerHTML = `
      <p style="color:red">
        Could not get advice. Please try again.
      </p>`;
  }

  btn.innerText = "🚨 Get Emergency Advice";
  btn.disabled = false;
}

// ============================================
// INIT
// ============================================

window.onload = () => {
  listenToBloodBanks();
  listenToDonors();
  initMap();
};
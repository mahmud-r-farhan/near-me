let map, marker, socket;
const authContainer = document.getElementById('auth-container');
const mapContainer = document.getElementById('map-container');
const markers = {};



// Authentication Event Listeners
document.getElementById('login-button').addEventListener('click', login);
document.getElementById('register-button').addEventListener('click', register);
document.getElementById('logout-button').addEventListener('click', logout);

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        showMap();
    } catch (error) {
        showError('Login failed. Wrong Credentials, Invalid Mail or Password');
    }
}

async function register(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) throw new Error('Registration failed');

        showSuccess('Registration successful. Please log in.');
        document.querySelector('[data-tab="login"]').click(); // Switch to login tab
    } catch (error) {
        showError('Registration failed. Please try again.');
    }
}

function logout() {
    localStorage.clear(); // Clear all stored items
    socket.disconnect();
    toggleView(authContainer, mapContainer);
    map.remove();
}

function showMap() {
    toggleView(mapContainer, authContainer); // Show map and hide auth container

    map = L.map("map").setView([0, 0], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Mahmud R. Farhan"
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
            marker = L.marker([latitude, longitude]).addTo(map);
            updateLocation(latitude, longitude);
            setupSocket();
        },
        error => {
            console.error('Error getting location:', error);
            alert('Unable to get your location. Please enable location services.');
        }
    );
}

async function updateLocation(latitude, longitude) {
    try {
        await fetch('/api/location/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ latitude, longitude })
        });
    } catch (error) {
        console.error('Error updating location:', error);
    }
}

function setupSocket() {
    socket = io({
        query: { token: localStorage.getItem('token') }
    });

    socket.on('locationUpdate', data => {
       if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setIcon(icon);
        markers[id].bindPopup(popupContent).openPopup();
    } else {
        markers[id] = L.marker([latitude, longitude], { icon: icon }).addTo(map)
            .bindPopup(popupContent).openPopup();
    }
    });

    socket.on('userDisconnected', userId => {
        if (markers[userId]) {
            map.removeLayer(markers[userId]);
            delete markers[userId];
        }
    });

    // Emit location updates every 10 seconds
    setInterval(() => {
        if (marker) {
            const { lat, lng } = marker.getLatLng();
            socket.emit('updateLocation', { 
                location: { coordinates: [lng, lat] },
                deviceName: getDeviceName()
            });
        }
    }, 10000);
}

// Utility function to generate popup content
function getUserPopupContent(username, deviceName, coordinates) {
    const [lng, lat] = coordinates;
    return `
        <h3>${username}</h3>
        <p>Device: ${deviceName}</p>
        <p>Latitude: ${lat.toFixed(6)}</p>
        <p>Longitude: ${lng.toFixed(6)}</p>
    `;
}

function getDeviceName() {
    const userAgent = navigator.userAgent;
    if (/Windows/.test(userAgent)) return 'Windows';
    if (/Mac/.test(userAgent)) return 'Mac';
    if (/Linux/.test(userAgent)) return 'Linux';
    if (/Android/.test(userAgent)) return 'Android';
    if (/iOS/.test(userAgent)) return 'iOS';
    return 'Unknown';
}

// Close user info popup when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.leaflet-popup')) {
        map.closePopup(); // Close any open popups
    }
});

// Helper function to toggle views
function toggleView(showElement, hideElement) {
    hideElement.style.display = 'none';
    showElement.style.display = 'block';
}

// Improved success and error messages
function showError(message) {
    displayMessage('error-message', message);
}

function showSuccess(message) {
    displayMessage('success-message', message);
}

function displayMessage(className, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = message;
    document.querySelector('.auth-box').appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Check if user is already logged in
if (localStorage.getItem('token')) {
    showMap();
}

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${tabName}-form`).classList.add('active');
    });
});

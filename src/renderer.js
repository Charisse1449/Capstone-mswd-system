function goToLogin() {
  window.location.href = 'login.html';
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToResidents() {
  window.location.href = 'residents.html';
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'admin123') {
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid username or password.');
  }
}

function showMessage(title, message) {
  alert(title + '\n\n' + message);
}

function openAddResident() {
  alert('Add Resident form will be added next.');
}
// Encrypt (simple Base64 for demo)
function encryptLink() {
  const url = document.getElementById("url").value;
  const pass = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;
  const expire = document.getElementById("expire").value;

  if (!url || !pass) {
    alert("Please enter all fields.");
    return;
  }
  if (pass !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  const data = { url, pass, expire };
  const encoded = btoa(JSON.stringify(data));
  const link = `${window.location.origin}${window.location.pathname.replace("index.html","")}unlock.html?data=${encoded}`;

  document.getElementById("output").value = link;
}

function copyOutput() {
  const out = document.getElementById("output");
  out.select();
  document.execCommand("copy");
  alert("Copied!");
}

// Unlock
function unlockLink() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("data");
  if (!encoded) {
    alert("No locked link data found.");
    return;
  }

  const { url, pass, expire } = JSON.parse(atob(encoded));
  const inputPass = document.getElementById("unlock-password").value;

  if (inputPass !== pass) {
    alert("Wrong password!");
    return;
  }

  // Loading animation
  const loadingBox = document.getElementById("loading");
  const text = document.getElementById("loading-text");
  loadingBox.style.display = "block";

  const messages = [
    "Checking Database...",
    "Searching Your Link...",
    "Checking Expire Time...",
    "Please Wait..."
  ];

  let i = 0;
  const interval = setInterval(() => {
    text.textContent = messages[i];
    i++;
    if (i >= messages.length) {
      clearInterval(interval);
      checkExpire(url, expire);
    }
  }, 1500);
}

function checkExpire(url, expire) {
  const now = new Date();
  if (expire && new Date(expire) < now) {
    // Expired
    document.getElementById("loading").style.display = "none";
    document.getElementById("expired-box").style.display = "block";
    showPopup();
  } else {
    window.open(url, "_blank");
    showPopup();
  }
}

// Popup with countdown
function showPopup() {
  const popup = document.getElementById("popup");
  const closeBtn = document.getElementById("closeBtn");
  let countdown = 4;

  popup.style.display = "block";
  closeBtn.textContent = `Close (${countdown})`;

  const timer = setInterval(() => {
    countdown--;
    closeBtn.textContent = `Close (${countdown})`;

    if (countdown <= 0) {
      clearInterval(timer);
      closeBtn.disabled = false;
      closeBtn.textContent = "Close";
      closeBtn.onclick = () => popup.style.display = "none";
    }
  }, 1000);
}

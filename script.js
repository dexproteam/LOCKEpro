function lockLink() {
  const url = document.getElementById("url").value;
  const password = document.getElementById("password").value;
  const expiry = document.getElementById("expiry").value;

  if (!url || !password) {
    alert("Please enter both URL and password.");
    return;
  }
  if (!url.startsWith("https://")) {
    alert("Only HTTPS links are allowed.");
    return;
  }

  const data = btoa(JSON.stringify({ url, password, expiry }));

  // Fix for GitHub Pages
  let base = window.location.origin + window.location.pathname;
  if (base.endsWith("index.html")) {
    base = base.replace("index.html", "");
  } else if (!base.endsWith("/")) {
    base += "/";
  }

  const lockedLink = `${base}unlock.html?data=${data}`;
  document.getElementById("output").value = lockedLink;
}

// Unlock Logic
const params = new URLSearchParams(window.location.search);
if (params.has("data")) {
  const data = JSON.parse(atob(params.get("data")));
  const loadingMessages = [
    "Checking Database...",
    "Searching Your Link...",
    "Checking Expire Time...",
    "Please Wait..."
  ];
  let msgIndex = 0;
  const loadingText = document.getElementById("loadingText");

  const interval = setInterval(() => {
    if (msgIndex < loadingMessages.length) {
      loadingText.textContent = loadingMessages[msgIndex];
      msgIndex++;
    } else {
      clearInterval(interval);
      checkExpiry(data);
    }
  }, 1500);
}

function checkExpiry(data) {
  document.getElementById("loading").classList.add("hidden");
  if (data.expiry && new Date(data.expiry) < new Date()) {
    // Expired → load expire page
    const iframe = document.createElement("iframe");
    iframe.src = "https://dexproteam.github.io/Expire/";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.body.appendChild(iframe);
    showPopup();
  } else {
    showPopup();
  }
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  let count = 4;
  const btn = document.getElementById("closePopup");
  btn.innerText = `Close (${count})`;

  const timer = setInterval(() => {
    count--;
    btn.innerText = `Close (${count})`;
    if (count <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.innerText = "Close";
      btn.onclick = () => {
        popup.classList.add("hidden");
        document.getElementById("unlockContainer").classList.remove("hidden");
      };
    }
  }, 1000);
}

function unlockLink() {
  const data = JSON.parse(atob(new URLSearchParams(window.location.search).get("data")));
  const enteredPass = document.getElementById("unlockPassword").value;

  if (enteredPass === data.password) {
    const frame = document.getElementById("unlockedFrame");
    frame.src = data.url;
    frame.classList.remove("hidden");
  } else {
    alert("Wrong password!");
  }
}

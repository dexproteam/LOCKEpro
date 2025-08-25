function lockLink() {
  const url = document.getElementById("url").value;
  const password = document.getElementById("password").value;
  const expiry = document.getElementById("expiry").value;

  if (!url || !password) {
    alert("Please enter both URL and password.");
    return;
  }

  const data = btoa(JSON.stringify({ url, password, expiry }));
  const lockedLink = `${window.location.origin}${window.location.pathname.replace("index.html","")}unlock.html?data=${data}`;
  document.getElementById("output").value = lockedLink;
}

function copyOutput() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("Copied!");
}

// Unlock Page Logic
window.onload = function () {
  if (window.location.pathname.includes("unlock.html")) {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) return;

    const { url, password, expiry } = JSON.parse(atob(data));

    // Show typing loading animation
    const messages = [
      "Checking Database...",
      "Searching Your Link...",
      "Checking Expire Time...",
      "Please Wait..."
    ];
    let i = 0;
    const loadingText = document.getElementById("loading-text");

    const interval = setInterval(() => {
      loadingText.textContent = messages[i];
      i++;
      if (i === messages.length) {
        clearInterval(interval);
        checkExpiry(url, password, expiry);
      }
    }, 1500);
  }
};

function checkExpiry(url, password, expiry) {
  const loadingScreen = document.getElementById("loading-screen");
  if (expiry && new Date(expiry) < new Date()) {
    loadingScreen.style.display = "none";
    const expireFrame = document.getElementById("expire-frame");
    expireFrame.src = "https://dexproteam.github.io/Expire/";
    expireFrame.classList.remove("hidden");
  } else {
    loadingScreen.style.display = "none";
    showPopup(url, password);
  }
}

function showPopup(url, password) {
  const popup = document.getElementById("popup");
  const closeBtn = document.getElementById("close-btn");
  popup.classList.remove("hidden");

  let count = 4;
  const countdown = setInterval(() => {
    count--;
    closeBtn.textContent = `Close (${count})`;
    if (count === 0) {
      clearInterval(countdown);
      closeBtn.disabled = false;
      closeBtn.textContent = "Close";
      closeBtn.onclick = () => {
        popup.classList.add("hidden");
        document.getElementById("unlock-container").classList.remove("hidden");
        window._lockedData = { url, password };
      };
    }
  }, 1000);
}

function unlockLink() {
  const inputPass = document.getElementById("unlock-password").value;
  if (inputPass === window._lockedData.password) {
    window.location.href = window._lockedData.url;
  } else {
    alert("Wrong password!");
  }
}

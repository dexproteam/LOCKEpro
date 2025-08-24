// Generate locked link
function lockLink() {
  const url = document.getElementById("url").value;
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  const expire = document.getElementById("expire").value;

  if (!url.startsWith("https://")) {
    alert("Link must start with https://");
    return;
  }
  if (pass !== confirm || pass === "") {
    alert("Passwords do not match!");
    return;
  }
  if (!expire) {
    alert("Please set an expire date & time.");
    return;
  }

  const data = btoa(JSON.stringify({ url, pass, expire }));
  const link = `${window.location.origin}${window.location.pathname.replace("index.html","")}unlock.html?data=${data}`;
  document.getElementById("output").value = link;
}

// Copy link
function copyOutput() {
  const out = document.getElementById("output");
  out.select();
  document.execCommand("copy");
  alert("Link copied!");
}

// Unlock page logic
function startUnlock() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");
  if (!data) return;

  const decoded = JSON.parse(atob(data));
  const now = new Date().getTime();
  const expireTime = new Date(decoded.expire).getTime();

  // Loading animation text
  const texts = ["Checking Database...", "Searching Your Link...", "Checking Expire Time...", "Please Wait..."];
  let i = 0;
  const loadingBox = document.getElementById("loading-text");
  const interval = setInterval(() => {
    loadingBox.innerText = texts[i];
    i++;
    if (i >= texts.length) {
      clearInterval(interval);

      if (now > expireTime) {
        // Expired
        document.getElementById("loading-box").classList.add("hidden");
        document.getElementById("result-frame").src = "https://dexproteam.github.io/Expire/";
        document.getElementById("result-frame").classList.remove("hidden");
        showPopup();
      } else {
        // Valid
        document.getElementById("loading-box").classList.add("hidden");
        showPopup(() => {
          document.getElementById("unlock-box").classList.remove("hidden");
          window._lockedData = decoded;
        });
      }
    }
  }, 1500);
}

// Show popup with countdown
function showPopup(callback) {
  const popup = document.getElementById("popup");
  const closeBtn = document.getElementById("closePopup");
  popup.classList.remove("hidden");

  let count = 4;
  closeBtn.innerText = `Close (${count})`;
  const timer = setInterval(() => {
    count--;
    closeBtn.innerText = `Close (${count})`;
    if (count <= 0) {
      clearInterval(timer);
      closeBtn.innerText = "Close";
      closeBtn.disabled = false;
      closeBtn.onclick = () => {
        popup.classList.add("hidden");
        if (callback) callback();
      };
    }
  }, 1000);
}

// Unlock the link
function unlockLink() {
  const pass = document.getElementById("unlock-password").value;
  if (pass === window._lockedData.pass) {
    document.getElementById("unlock-box").classList.add("hidden");
    document.getElementById("result-frame").src = window._lockedData.url;
    document.getElementById("result-frame").classList.remove("hidden");
  } else {
    alert("Wrong password!");
  }
}

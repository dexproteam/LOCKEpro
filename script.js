function lockLink() {
  const url = document.getElementById("url").value.trim();
  const password = document.getElementById("password").value.trim();
  const expiry = document.getElementById("expiry").value;

  if (!url || !password) {
    alert("Please enter URL and password.");
    return;
  }

  const data = btoa(JSON.stringify({ url, password, expiry }));

  let base = window.location.origin + window.location.pathname;
  if (base.endsWith("index.html")) base = base.replace("index.html", "");
  if (!base.endsWith("/")) base += "/";

  const lockedLink = `${base}unlock.html?data=${data}`;
  document.getElementById("output").value = lockedLink;
}

function copyLink() {
  const outputBox = document.getElementById("output");
  if (!outputBox.value) {
    alert("No link generated!");
    return;
  }
  outputBox.select();
  navigator.clipboard.writeText(outputBox.value).then(() => {
    alert("Copied!");
  });
}

function openLink() {
  const link = document.getElementById("output").value;
  if (link) window.open(link, "_blank");
}

// ===== UNLOCK PAGE =====
const params = new URLSearchParams(window.location.search);
if (params.has("data")) {
  const data = JSON.parse(atob(params.get("data")));

  // Show loading texts
  const loadingTexts = [
    "Checking Database...",
    "Searching Your Link...",
    "Checking Expire Time...",
    "Please Wait..."
  ];
  let i = 0;
  const loadingEl = document.getElementById("loading-text");
  const interval = setInterval(() => {
    if (loadingEl) loadingEl.textContent = loadingTexts[i];
    i++;
    if (i >= loadingTexts.length) {
      clearInterval(interval);
      document.getElementById("loading").style.display = "none";

      // Expiry check
      if (data.expiry && new Date(data.expiry) < new Date()) {
        document.getElementById("resultFrame").style.display = "block";
        document.getElementById("resultFrame").src = "https://dexproteam.github.io/Expire/";
      } else {
        showPopup(() => {
          document.getElementById("unlockContainer").classList.remove("hidden");
          window.lockedData = data;
        });
      }
    }
  }, 1500);
}

function showPopup(callback) {
  const popup = document.getElementById("popup");
  const btn = document.getElementById("closeBtn");
  let count = 4;
  popup.style.visibility = "visible";

  const countdown = setInterval(() => {
    btn.textContent = `Close (${count})`;
    count--;
    if (count < 0) {
      clearInterval(countdown);
      btn.disabled = false;
      btn.textContent = "Close";
      btn.onclick = () => {
        popup.style.visibility = "hidden";
        if (callback) callback();
      };
    }
  }, 1000);
}

function unlockLink() {
  const pass = document.getElementById("unlockPass").value.trim();
  if (pass === window.lockedData.password) {
    const frame = document.getElementById("resultFrame");
    frame.style.display = "block";
    frame.src = window.lockedData.url;
  } else {
    alert("Wrong password!");
  }
}

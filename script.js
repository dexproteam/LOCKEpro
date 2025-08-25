function lockLink() {
  const url = document.getElementById("url").value.trim();
  const password = document.getElementById("password").value.trim();
  const expiry = document.getElementById("expiry").value;

  if (!url || !password) {
    alert("Please enter both URL and password.");
    return;
  }

  const data = btoa(JSON.stringify({ url, password, expiry }));

  // GitHub Pages + Local এ ঠিকভাবে কাজ করার জন্য
  let base = window.location.origin + window.location.pathname;
  if (base.endsWith("index.html")) {
    base = base.replace("index.html", "");
  }
  if (!base.endsWith("/")) {
    base += "/";
  }

  const lockedLink = `${base}unlock.html?data=${data}`;

  // Output বক্সে লিংক দেখানো
  const outputBox = document.getElementById("output");
  outputBox.value = lockedLink;
}

// Copy Function
function copyLink() {
  const outputBox = document.getElementById("output");
  if (!outputBox.value) {
    alert("No link generated yet!");
    return;
  }

  // মোবাইল + ডেস্কটপে কপি করার জন্য
  outputBox.select();
  outputBox.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(outputBox.value).then(() => {
    alert("Link copied!");
  }).catch(() => {
    alert("Failed to copy link.");
  });
}

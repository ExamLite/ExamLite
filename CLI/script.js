const editor = document.getElementById('editor');
const wordCountEl = document.getElementById('word-count');
const btnDownload = document.getElementById('btn-download');
const btnClear = document.getElementById('btn-clear');

const promptOverlay = document.getElementById('filename-prompt');
const filenameInput = document.getElementById('filename-input');
const filenameOK = document.getElementById('filename-ok');
const filenameCancel = document.getElementById('filename-cancel');

function updateWordCount() {
  const text = editor.innerText || "";
  const words = text.trim().split(/\s+/).filter(Boolean);
  wordCountEl.textContent = "Words: " + (words.length || 0);
}

editor.addEventListener('input', updateWordCount);
window.addEventListener('load', updateWordCount);

// Show fake CLI filename prompt
btnDownload.addEventListener('click', () => {
  filenameInput.value = "";   // always blank
  promptOverlay.style.display = "flex";
  filenameInput.focus();
});

// Cancel prompt
filenameCancel.addEventListener('click', () => {
  promptOverlay.style.display = "none";
});

// Confirm save
filenameOK.addEventListener('click', () => {
  let filename = filenameInput.value.trim();

  // If no extension, add .doc
  if (!filename.includes(".")) {
    filename += ".doc";
  }

  const content = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${filename}</title>
</head>
<body>
${editor.innerHTML}
</body>
</html>`;

  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  promptOverlay.style.display = "none";
});

// Clear editor
btnClear.addEventListener('click', () => {
  if (confirm("Clear all text?")) {
    editor.innerHTML = "";
    updateWordCount();
  }
});

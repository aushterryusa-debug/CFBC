import { importFile, saveToFirestore } from './importer.js';
import { db, getDocs, collection } from './firebase.js';

// DOM elements
const fileInput = document.getElementById('file-input');
const importBtn = document.getElementById('import-btn');
const preview = document.getElementById('preview');
const status = document.getElementById('status');
const importsList = document.getElementById('imports-list');

function setStatus(msg, isError = false) {
  status.textContent = msg;
  status.className = isError ? 'status error' : 'status success';
}

// Handle file import
importBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    setStatus('Please select a file first.', true);
    return;
  }

  try {
    setStatus('Importing...');
    const data = await importFile(file);

    // Show preview
    if (data.type === 'markdown') {
      preview.innerHTML = `<h3>Markdown Preview: ${data.name}</h3>${data.html}`;
    } else if (data.type === 'excel') {
      const sheetNames = Object.keys(data.sheets);
      let html = `<h3>Excel Preview: ${data.name}</h3>`;
      for (const name of sheetNames) {
        const rows = data.sheets[name];
        if (rows.length === 0) continue;
        html += `<h4>Sheet: ${name}</h4>`;
        html += '<table><thead><tr>';
        for (const key of Object.keys(rows[0])) {
          html += `<th>${key}</th>`;
        }
        html += '</tr></thead><tbody>';
        for (const row of rows.slice(0, 20)) {
          html += '<tr>';
          for (const val of Object.values(row)) {
            html += `<td>${val}</td>`;
          }
          html += '</tr>';
        }
        html += '</tbody></table>';
        if (rows.length > 20) {
          html += `<p><em>Showing 20 of ${rows.length} rows</em></p>`;
        }
      }
      preview.innerHTML = html;
    }

    // Save to Firestore (only when Firebase is configured)
    try {
      const id = await saveToFirestore({
        type: data.type,
        name: data.name,
        rowCount: data.type === 'excel'
          ? Object.values(data.sheets).reduce((sum, s) => sum + s.length, 0)
          : null,
      });
      setStatus(`Imported and saved! Document ID: ${id}`);
    } catch {
      setStatus('Previewed locally (Firebase not configured yet).');
    }
  } catch (err) {
    setStatus(`Error: ${err.message}`, true);
  }
});

// Load existing imports from Firestore
async function loadImports() {
  try {
    const snapshot = await getDocs(collection(db, 'imports'));
    importsList.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
      li.textContent = `${data.name} (${data.type}) - ${data.importedAt}`;
      importsList.appendChild(li);
    });
  } catch {
    importsList.innerHTML = '<li>Firebase not configured yet - imports will show here once connected.</li>';
  }
}

loadImports();

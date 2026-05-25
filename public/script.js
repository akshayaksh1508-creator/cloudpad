const homePage = document.getElementById('homePage');
const roomPage = document.getElementById('roomPage');
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const homeBtn = document.getElementById('homeBtn');
const copyBtn = document.getElementById('copyBtn');
const roomTitle = document.getElementById('roomTitle');
const roomLink = document.getElementById('roomLink');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filesGrid = document.getElementById('filesGrid');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const fileCardTemplate = document.getElementById('fileCardTemplate');

let currentRoom = '';
let allFiles = [];

function cleanRoomName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    message.textContent = '';
  }, 3500);
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileEmoji(ext) {
  const map = {
    '.pdf': '📕',
    '.doc': '📘',
    '.docx': '📘',
    '.xls': '📗',
    '.xlsx': '📗',
    '.ppt': '📙',
    '.pptx': '📙',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.zip': '🗜️',
    '.txt': '📄'
  };
  return map[ext] || '📁';
}

function navigateToRoom(roomName) {
  const clean = cleanRoomName(roomName);
  if (!clean) {
    alert('Please enter a room name');
    return;
  }
  window.history.pushState({}, '', `/${clean}`);
  loadRoom(clean);
}

async function loadRoom(roomName) {
  currentRoom = roomName;
  homePage.classList.add('hidden');
  roomPage.classList.remove('hidden');
  roomTitle.textContent = roomName;
  roomLink.textContent = window.location.href;

  const res = await fetch(`/api/room/${roomName}`);
  const room = await res.json();
  allFiles = room.files || [];
  renderFiles(allFiles);
}

function renderFiles(files) {
  filesGrid.innerHTML = '';

  if (!files.length) {
    filesGrid.innerHTML = '<p class="empty-state">No files found. Upload your first file.</p>';
    return;
  }

  files.forEach(file => {
    const card = fileCardTemplate.content.cloneNode(true);
    const icon = card.querySelector('.file-icon');
    const title = card.querySelector('h4');
    const meta = card.querySelector('p');
    const download = card.querySelector('.download-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    icon.textContent = fileEmoji(file.ext);
    title.textContent = file.originalName;
    meta.textContent = `${formatSize(file.size)} • ${new Date(file.uploadedAt).toLocaleString()}`;
    download.href = file.url;
    download.setAttribute('download', file.originalName);

    deleteBtn.addEventListener('click', () => deleteFile(file.id));
    filesGrid.appendChild(card);
  });
}

async function uploadFiles(files) {
  if (!files.length) return;

  const formData = new FormData();
  [...files].forEach(file => formData.append('files', file));

  showMessage('Uploading files...');

  try {
    const res = await fetch(`/api/room/${currentRoom}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');

    allFiles = [...data.files, ...allFiles];
    renderFiles(allFiles);
    showMessage('Files uploaded successfully');
  } catch (err) {
    showMessage(err.message);
  }
}

async function deleteFile(fileId) {
  const confirmDelete = confirm('Delete this file?');
  if (!confirmDelete) return;

  const res = await fetch(`/api/room/${currentRoom}/file/${fileId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    allFiles = allFiles.filter(file => file.id !== fileId);
    renderFiles(allFiles);
    showMessage('File deleted');
  } else {
    showMessage('Could not delete file');
  }
}

joinBtn.addEventListener('click', () => navigateToRoom(roomInput.value));
roomInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') navigateToRoom(roomInput.value);
});

homeBtn.addEventListener('click', () => {
  window.history.pushState({}, '', '/');
  roomPage.classList.add('hidden');
  homePage.classList.remove('hidden');
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(window.location.href);
  showMessage('Room link copied');
});

browseBtn.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('click', e => {
  if (e.target !== browseBtn) fileInput.click();
});

fileInput.addEventListener('change', e => uploadFiles(e.target.files));

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });
});

dropZone.addEventListener('drop', e => uploadFiles(e.dataTransfer.files));

searchInput.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  const filtered = allFiles.filter(file => file.originalName.toLowerCase().includes(term));
  renderFiles(filtered);
});

window.addEventListener('popstate', () => {
  const room = cleanRoomName(location.pathname.replace('/', ''));
  if (room) loadRoom(room);
  else {
    roomPage.classList.add('hidden');
    homePage.classList.remove('hidden');
  }
});

const initialRoom = cleanRoomName(location.pathname.replace('/', ''));
if (initialRoom) loadRoom(initialRoom);

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ rooms: {} }, null, 2));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function cleanRoomName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${nanoid(8)}-${safeOriginal}`);
  }
});

const allowedExt = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.zip', '.txt'];
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) return cb(new Error('File type not allowed'));
    cb(null, true);
  }
});

app.get('/api/room/:roomName', (req, res) => {
  const roomName = cleanRoomName(req.params.roomName);
  const data = readData();

  if (!data.rooms[roomName]) {
    data.rooms[roomName] = {
      id: roomName,
      createdAt: new Date().toISOString(),
      files: []
    };
    writeData(data);
  }

  res.json(data.rooms[roomName]);
});

app.post('/api/room/:roomName/upload', upload.array('files', 10), (req, res) => {
  const roomName = cleanRoomName(req.params.roomName);
  const data = readData();

  if (!data.rooms[roomName]) {
    data.rooms[roomName] = {
      id: roomName,
      createdAt: new Date().toISOString(),
      files: []
    };
  }

  const uploadedFiles = req.files.map(file => ({
    id: nanoid(10),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    type: file.mimetype,
    ext: path.extname(file.originalname).toLowerCase(),
    url: `/uploads/${file.filename}`,
    uploadedAt: new Date().toISOString()
  }));

  data.rooms[roomName].files.unshift(...uploadedFiles);
  writeData(data);

  res.json({ success: true, files: uploadedFiles });
});

app.delete('/api/room/:roomName/file/:fileId', (req, res) => {
  const roomName = cleanRoomName(req.params.roomName);
  const { fileId } = req.params;
  const data = readData();

  const room = data.rooms[roomName];
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const file = room.files.find(f => f.id === fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });

  const filePath = path.join(UPLOAD_DIR, file.storedName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  room.files = room.files.filter(f => f.id !== fileId);
  writeData(data);

  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`CloudPad running on http://localhost:${PORT}`);
});

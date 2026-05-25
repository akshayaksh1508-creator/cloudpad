# CloudPad - Modern Dontpad Style File Sharing Website

CloudPad is a room-based file sharing website where users can create/open any room and upload PDF, Word, Excel, PPT, images, ZIP, and text files.

## Features

- Modern responsive UI
- Room based sharing
- Upload multiple files
- Drag and drop upload
- Download files
- Delete files
- Search uploaded files
- Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG, JPEG, ZIP, TXT
- Local JSON storage
- Local uploads folder storage

## How to Run

```bash
npm install
npm start
```

Open:

```bash
http://localhost:3000
```

## For development

```bash
npm run dev
```

## Folder Structure

```text
cloudpad/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── uploads/
├── data.json
├── package.json
└── server.js
```

## Important

This version stores files locally in the `uploads` folder. For deployment, use cloud storage like Firebase Storage, Cloudinary, or AWS S3.

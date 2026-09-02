# ðŸ“ CloudPad â€” Real-time Collaborative Notepad

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Write together, in real time.**

</div>

---

## ðŸš€ Overview

CloudPad is a real-time collaborative notepad application â€” like Google Docs but lightweight. Multiple users can open the same pad, type simultaneously, and see each other's changes instantly via WebSockets. No account needed, just share the link.

## âœ¨ Features

- âš¡ **Real-time sync** â€” all connected users see changes instantly
- ðŸ”— **Shareable pads** â€” unique URL for each notepad session
- ðŸ’¾ **Auto-save** â€” content persisted in JSON storage
- ðŸŽ¨ **Clean UI** â€” minimal, distraction-free writing interface
- ðŸ‘¥ **Multi-user** â€” unlimited simultaneous editors

## ðŸ› ï¸ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js, Express.js |
| **Real-time** | WebSockets (ws / Socket.io) |
| **Storage** | JSON file-based persistence (`data.json`) |
| **Frontend** | Vanilla JavaScript, HTML5, CSS3 |

## ðŸ“ Project Structure

```
cloudpad/
â”œâ”€â”€ server.js        # Express + WebSocket server
â”œâ”€â”€ data.json        # Persistent pad storage
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ index.html   # Main UI
â”‚   â”œâ”€â”€ style.css
â”‚   â””â”€â”€ client.js    # WebSocket client
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## âš¡ Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/akshayaksh1508-creator/cloudpad.git
cd cloudpad
npm install
```

### Run the Server

```bash
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Open multiple tabs to test real-time collaboration!

## ðŸ”’ Security Note

> [!NOTE]
> This project uses file-based storage for simplicity. For production, replace `data.json` with a proper database (MongoDB, PostgreSQL).

## ðŸ“„ License

MIT License

---

<div align="center">
Made with â¤ï¸ by <a href="https://github.com/akshayaksh1508-creator">Akshay</a>
</div>

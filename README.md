
#  Full-Stack mini-Admin Panel

A mini admin panel with user management, built with Next.js (frontend) and Node.js/Express (backend), featuring Protocol Buffers serialization and RSA digital signatures.

## Features

- ✅ Full CRUD operations for user management
- ✅ SQLite database for data persistence
- ✅ Protocol Buffers serialization for data export
- ✅ RSA digital signatures for data verification
- ✅ SHA-384 email hashing
- ✅ User creation statistics (last 7 days chart)
- ✅ Signature verification on frontend
- ✅ Modern UI with Tailwind CSS

## Tech Stack

**Backend:**
- Node.js & Express
- SQLite3
- Protocol Buffers (protobufjs)
- Crypto (RSA signatures, SHA-384 hashing)

**Frontend:**
- Next.js 15 (App Router)
- React
- Tailwind CSS
- Chart.js & react-chartjs-2
- Protocol Buffers (protobufjs)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd qt-admin-panel
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

**Note:** On first run, the backend will:
- Create a SQLite database file (`database.sqlite`)
- Generate RSA keypair in the `keys/` directory
- Initialize the users table

### 3. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`


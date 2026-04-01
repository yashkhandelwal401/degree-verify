# Degree Verify - Frontend + Backend

This is a local MVP for a blockchain-inspired academic certificate verification system.

## What is included

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Features:**
  - University uploads certificate PDF
  - Backend generates SHA-256 hash
  - Mock IPFS stores file reference
  - Mock blockchain stores certificate proof
  - Employer verifies uploaded PDF
  - Student approves or rejects original file access request
  - Verification link page

## Project Structure

```bash
degree-verify/
  frontend/
  backend/
  README.md
```

## Requirements

Install these first:

- Node.js 18 or higher
- npm

Check versions:

```bash
node -v
npm -v
```

## Step-by-step local setup

### 1) Extract the project

Unzip the downloaded file.

### 2) Open terminal in project folder

```bash
cd degree-verify
```

### 3) Setup backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend will start on:

```bash
http://localhost:5000
```

Test backend health:

```bash
http://localhost:5000/api/health
```

### 4) Setup frontend

Open a **new terminal**:

```bash
cd degree-verify/frontend
npm install
npm run dev
```

Frontend will start on:

```bash
http://localhost:5173
```

## How to test the project locally

### University flow

1. Open `http://localhost:5173`
2. Go to **University**
3. Fill in:
   - student name
   - student email
   - university name
   - degree
   - graduation year
4. Upload a PDF certificate
5. Click **Upload Certificate**
6. A verification link will appear in the issued certificates list

### Employer flow

1. Go to **Employer**
2. Upload the same PDF certificate
3. Click **Verify Certificate**
4. You should see **Verified** if the file is unchanged
5. Upload a modified PDF and it will show **Invalid**

### Student flow

1. Go to **Student**
2. Enter the same student email used in upload
3. Click **Load Requests**
4. Approve or reject employer access requests
5. After approval, a temporary download link is shown

## Important notes

- This version uses **mock IPFS** and **mock blockchain** services.
- It does **not** connect to real Ethereum, Hyperledger, Pinata, or IPFS nodes.
- Data is stored in memory and local upload files.
- If backend restarts, uploaded records are reset.

## API endpoints

### Backend routes

- `GET /api/health`
- `POST /api/certificates/upload`
- `POST /api/certificates/verify`
- `GET /api/certificates`
- `GET /api/certificates/:id`
- `POST /api/certificates/:id/request-access`
- `GET /api/students/:studentEmail/requests`
- `PATCH /api/requests/:requestId/approve`
- `PATCH /api/requests/:requestId/reject`
- `GET /api/certificates/:id/download`

## Example test data

Use any PDF file and sample values like:

- Student name: Amit Kumar Pattanayak
- Student email: student@example.com
- University: ABC University
- Degree: B.Tech CSE
- Graduation Year: 2026

## Common issues

### Port already in use

Change backend port in `.env` and update frontend API base in:

```bash
frontend/src/services/api.js
```

### CORS issue

Make sure backend `.env` has:

```env
FRONTEND_URL=http://localhost:5173
```

### File not verifying

Use the **exact same PDF** for upload and verification.
Even a one-byte change creates a different hash.

## Future improvements

- MongoDB or PostgreSQL database
- Real IPFS integration
- Real smart contract integration
- JWT authentication
- Role-based login
- Wallet signature verification
- Email notifications
- Revocation feature


# MERN Contact Manager

Simple, beginner-friendly MERN (MongoDB + Express + React + Node.js) app to manage contacts.

## Folder Structure

```
ContactManagement/
  package.json
  .gitignore
  backend/
    controllers/
      contactController.js
    config/
      db.js
    middleware/
      asyncHandler.js
      errorHandler.js
    models/
      Contact.js
    routes/
      contactRoutes.js
    server.js
    .env.example
  frontend/
    src/
      api/
      components/
      App.jsx
      main.jsx
    index.html
    vite.config.js
    .env.example
```

## What’s Included

- Backend REST API (Express + Mongoose)
  - `GET /contacts` - fetch all contacts
  - `POST /contacts` - create a contact
  - `PUT /contacts/:id` - update a contact
  - `DELETE /contacts/:id` - delete a contact
- Frontend React UI
  - Add contact
  - Show all contacts
  - Update contact
  - Delete contact
- Basic validation, loading states, and graceful error messages.

## Run Locally

### 1) MongoDB

You can use either:

- MongoDB Atlas (recommended)
- Local MongoDB server

You’ll need a MongoDB Atlas connection string (for the backend `MONGO_URI`).

### 2) Backend (Express + MongoDB)

1. Open a terminal:
   - `cd ContactManagement/backend`
2. Install dependencies:
   - `npm install`
3. Create `.env` from the example:
   - `cp .env.example .env` (Windows: copy the file manually)
4. Edit `.env`:
   - `MONGO_URI` = your connection string
   - `PORT` = `5000` (or any free port)
   - `CORS_ORIGIN` = your frontend URL (optional). Defaults to `*`.
5. Start the server:
   - `npm run dev`

Backend should be running at `http://localhost:5000`.

To test the API:
- Open `http://localhost:5000/contacts` in your browser (GET all contacts)
- Use Postman to send `POST /contacts` with JSON body: `{ "name": "...", "email": "...", "phone": "..." }`

### 3) Frontend (React)

1. Open a new terminal:
   - `cd ContactManagement/frontend`
2. Install dependencies:
   - `npm install`
3. Create `.env` from the example:
   - `cp .env.example .env` (Windows: copy the file manually)
4. Edit `.env`:
   - `VITE_API_BASE_URL` = `http://localhost:5000` (dev only)
5. Start the frontend:
   - `npm run dev`

Frontend runs at the Vite URL (usually `http://localhost:5173`).

## Deployment (Single Public URL on Render)

This repo is set up so **the backend serves the frontend build** (single URL).

### Render (Web Service)

1. Push your code to GitHub.
2. In Render: New Web Service.
3. Set Root Directory to:
   - `ContactManagement`
4. Build Command:
   - `npm run install:all && npm run build`
5. Start Command:
   - `npm start`
6. Add Environment Variables (Render dashboard):
   - `MONGO_URI` = your MongoDB connection string
   - (Render automatically sets `PORT`; you do not need to add it)
   - Optional: `CORS_ORIGIN` (you can leave it `*` since frontend is same-origin on Render)

After deploy, your app will be accessible at a **single URL**, e.g. `https://your-app.onrender.com`.

## Notes / Troubleshooting

- If the frontend can’t load contacts on Render, confirm the Render build completed and `frontend/dist` exists.
- If MongoDB connection fails, verify `MONGO_URI` (including credentials) and that your IP is allowed (for Atlas).


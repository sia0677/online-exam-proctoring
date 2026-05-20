# Deployment Guide

This guide explains how to deploy the **Online Exam and Proctoring Platform** to production.

---

## Why did the Vercel build fail?
By default, Vercel attempts to build the project from the **root directory** of the repository. Because the React/Vite frontend code is located inside the `Frontend` subdirectory:
1. Vercel looked for a `package.json` at the root and could not find it.
2. It failed with `command npm run build exited 1` (or similar missing package.json/script errors).

To fix this, you need to configure the **Root Directory** setting in your Vercel Project Settings.

---

## 1. Deploying the Frontend (on Vercel)

Follow these steps to deploy the frontend correctly:

1. **Import the Project in Vercel**:
   - Go to your [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your GitHub/GitLab repository for this project.

2. **Configure Project Settings** (Crucial Step):
   - In the **Configure Project** screen, find the **Root Directory** setting.
   - Click **Edit** next to it and select the **`Frontend`** directory (or type `Frontend`).
   - *This tells Vercel to install dependencies and run the build command inside the `Frontend` folder.*

3. **Set Environment Variables**:
   - Expand the **Environment Variables** section in Vercel.
   - Add the following variable:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://your-deployed-backend-url.com/api/v1` (Replace this with the actual URL of your deployed backend)
   - *Note: If you leave this blank, the app will fallback to `http://localhost:5000/api/v1`, which is only suitable for local development.*

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically detect Vite, run `npm install`, compile the assets, and deploy the application.

---

## 2. Deploying the Backend (on Render, Railway, etc.)

Since the backend is a Node.js / Express application, you can deploy it to hosting platforms like **Render**, **Railway**, or **Fly.io**.

### Configuration for Backend Deployment:
1. **Root Directory**: Set to **`Backend`**.
2. **Build Command**: `npm install` (or leave it to default).
3. **Start Command**: `npm start` (which runs `node src/server.js`).
4. **Environment Variables**: Add these key-value pairs in your backend hosting provider's dashboard:
   - `PORT`: `5000` (or the port provided by the host)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB connection string (e.g., MongoDB Atlas connection string)
   - `JWT_SECRET`: A secure random string for signing JWT tokens
   - `JWT_EXPIRE`: `30d`
   - `CRYPTO_SECRET`: A secure random string for encrypting sensitive data

---

## Local Development Reminder
For local development, you can run:
- **Backend**: `npm run dev` inside the `Backend` directory.
- **Frontend**: `npm run dev` inside the `Frontend` directory.

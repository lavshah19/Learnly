# Learnly

A full‑stack learning management system (LMS) with instructor course creation, bulk media uploads, student enrollment and progress tracking, and eSewa payment integration.

## Features
- **Authentication**: Register, login, JWT-based auth, role-aware access (student/instructor)
- **Instructor tools**: Create courses, manage curriculum, upload media to Cloudinary
- **Student experience**: Browse courses, purchase via eSewa, track course progress, resume playback
- **Payments**: eSewa integration with HMAC signature
- **Media handling**: Secure upload/delete via Cloudinary
- **Responsive UI**: Modern React + Tailwind

## Tech Stack
- **Frontend**: React 19, Vite, React Router, Tailwind CSS 4, Radix UI, Lucide, Axios
- **Backend**: Node.js, Express 5, Mongoose 8, JWT, Multer, Cloudinary SDK, dotenv, CORS
- **Database**: MongoDB (Atlas or self-hosted)
- **Payments**: eSewa (`esewajs` + custom HMAC utils)

## Project Structure
```
Learnly/
  backend/
    controllers/          # auth, instructor, student flows
    db/                   # Mongo connection
    helpers/              # cloudinary helpers
    middleware/           # auth middleware (JWT)
    models/               # Mongoose schemas: User, Course, etc.
    routes/               # REST endpoints
    utils/                # eSewa crypto utils
    server.js             # Express app bootstrap
  frontend/
    src/
      api/               # axios instance
      components/        # ui + views
      context/           # auth, instructor, student contexts
      pages/             # route pages
      services/          # API service functions
    vite.config.js
  README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (connection string)
- Cloudinary account (for media)
- eSewa merchant credentials

### Environment Variables
Create `.env` files in `backend/` and `frontend/`.

Backend (`backend/.env`):
```
PORT=3000
CLIENT_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# eSewa
MERCHANT_ID=your_merchant_id
SECRET=your_hmac_secret
SUCCESS_URL=http://localhost:5173/payment/success
FAILURE_URL=http://localhost:5173/payment/failure
```

Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

### Installation
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Run (Development)
Run backend and frontend in separate terminals:
```bash
# Backend (http://localhost:3000)
cd backend
npm run dev

# Frontend (http://localhost:5173)
cd frontend
npm run dev
```


```

## API Overview (selected)
Base URL: `http://localhost:3000/api`

- `POST /auth/register`, `POST /auth/login`
- `GET/POST /instructor/course` and subroutes for curriculum/media
- `GET /student/course` list, `GET /student/course/:id` details
- `POST /student/payment` eSewa initiation/callback
- `GET /student/my-courses` purchased courses
- `PATCH /student/course-progress` update playback/progress

JWT is required on protected routes via `Authorization: Bearer <token>`; see `backend/middleware/auth-middleware.js`.

## Frontend Notes
- Axios base URL reads `import.meta.env.VITE_API_URL` (see `frontend/src/api/axiosInstance.js`)
- Routing via React Router under `frontend/src/pages`
- Context providers handle auth, instructor, student states

## Development Tips
- If CORS blocks requests, ensure `CLIENT_URL` in backend `.env` matches your frontend origin
- Ensure MongoDB IP allowlist and credentials are correct
- For Cloudinary, verify keys and that `resource_type: "auto"` suits your assets
- For eSewa, confirm HMAC `SECRET`, success/failure URLs, and product codes

## Scripts
Backend (`backend/package.json`):
- `npm run dev` – start with nodemon
- `npm start` – start server

Frontend (`frontend/package.json`):
- `npm run dev` – Vite dev server
- `npm run build` – build
- `npm run preview` – preview build
- `npm run lint` – lint

## License
This project is for educational purposes. Add a license if you intend to distribute. 
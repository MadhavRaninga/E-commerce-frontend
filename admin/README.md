# Clothify Admin Panel

## Run

1) Start backend:

```bash
cd backend
npm install
npm start
```

2) Start admin:

```bash
cd admin
npm install
npm run dev
```

Admin runs on `http://localhost:5174`.

## Create your first admin user

### Option A (Recommended): MongoDB

Set `isAdmin:true` for your user document in MongoDB.

### Option B: Bootstrap endpoint (one-time)

1) Add env in `backend/.env`:

```
ADMIN_BOOTSTRAP_SECRET=yourStrongSecret
```

2) Call:

```bash
curl -X POST http://localhost:5000/api/bootstrap/make-admin ^
  -H "Content-Type: application/json" ^
  -d "{\"secret\":\"yourStrongSecret\",\"email\":\"your@email.com\"}"
```

Then login in admin panel with same email/password.


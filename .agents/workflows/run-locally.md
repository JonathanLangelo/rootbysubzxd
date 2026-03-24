---
description: How to run the Cyberpunk Portfolio locally
---

To get the project up and running on your local machine, follow these steps:

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory and add:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="<run: openssl rand -hex 32>"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="<run: node -e \"require('bcryptjs').hash('yourpassword',10).then(h=>console.log(h))\">"
BLOB_READ_WRITE_TOKEN="<from Vercel Dashboard → Storage → Blob>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Setup Database (PostgreSQL)
Generate the Prisma client and push the schema:
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Data
Populate the database with initial admin user and sample posts:
```bash
npm run seed
```

### 5. Start Development Server
// turbo
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 6. Admin Access
- **Login URL**: `http://localhost:3000/admin/login`
- **Default Credentials**: 
    - Username: `admin`
    - Password: `admin1337` (Change this in production!)

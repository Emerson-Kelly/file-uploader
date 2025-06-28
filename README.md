# File Uploader App

A simple cloud-like file uploader platform built with Node.js, Express, Prisma ORM, EJS, and Supabase. 

Users can sign up, create folders, upload files, download files, and view them in an organized folder structure.

---

## Features

User authentication (signup & login)  
Encrypted passwords with Bcrypt
Custom Prisma session store for express-session
Create folders and nested folders  
Upload files to folders  
Store files securely using Supabase Storage  
Organized dashboard with folders and files  
Simple UI with Tailwind CSS  
Supports renaming, deleting, and downloading folders/files

---

## Tech Stack

- Backend: Node.js, Express
- Database & ORM: PostgreSQL (via Supabase) + Prisma
- Authentication: Passport.js (local strategy)
- File storage: Supabase Storage
- Frontend: EJS templates + Tailwind CSS
- Deployment: Railway

# SprintForge

Sprint tracker built for developers. Kanban board, sprint progress tracking, artifact links, and a public portfolio page — no standups required.

## Stack

**Backend** — .NET 8, ASP.NET Core, EF Core, PostgreSQL, JWT  
**Frontend** — React 19, TypeScript, Vite, Axios, SCSS

## Features

- JWT authentication with role-based authorization
- Sprint management (create, update, delete, status tracking)
- Kanban board with task priority and due dates
- Artifact links per task (GitHub, docs, websites)
- Sprint progress bar with live percentage
- Profile page with bio and public portfolio toggle
- Public portfolio page at `/portfolio/:userId`

## Architecture

```
Backend/
  Controllers/     → thin, no try-catch, no manual mapping
  Application/
    Services/      → business logic + ILogger
    Interfaces/    → contracts
  Domain/Entities/ → EF Core models
  Dtos/            → request + response DTOs
  Mappings/        → AutoMapper profiles
  Middleware/      → global exception handler
  Exceptions/      → NotFoundException, ForbiddenException

client/src/
  pages/           → React pages
  components/      → Navbar, shared UI
  services/        → axios API calls
  styles/          → SCSS partials (@use module system)
```

## Running locally

**Backend**
```bash
cd Backend/SprintForge/SprintForge
dotnet run
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `https://localhost:7xxx`.

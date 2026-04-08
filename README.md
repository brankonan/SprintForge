# SprintForge

A sprint management and portfolio app built for student developers. Plan your work in focused sprints, track tasks on a kanban board, and share your progress through a public portfolio that others can browse.

## What it does

SprintForge gives you a simple but complete development workflow:

- Create sprints with a goal, description, and date range
- Break sprints down into tasks with priorities (High / Medium / Low) and due dates
- Move tasks through **To Do → In Progress → Done** on a kanban board
- Attach links to each task — GitHub repos, deployed apps, documents
- Track sprint progress with a live progress bar and stats
- Make your portfolio public so other students and mentors can explore your work

## Tech stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core (.NET 8) |
| Database | PostgreSQL + Entity Framework Core 8 |
| Auth | JWT Bearer tokens |
| Frontend | React 19 + Vite + TypeScript |
| Styling | SCSS (dark theme) |
| Architecture | Clean Architecture (Domain / Application / Infrastructure) |

## Project structure

```
SprintForge/
├── Backend/SprintForge/SprintForge/
│   ├── Domain/Entities/        # User, Sprint, SprintTask, Artifact
│   ├── Application/
│   │   ├── Interfaces/         # Service contracts
│   │   └── Services/           # Business logic
│   ├── Infrastructure/         # AppDbContext (EF Core + PostgreSQL)
│   ├── Controllers/            # REST API endpoints
│   └── Dtos/                   # Request / response models
└── client/src/
    ├── pages/                  # React pages
    ├── components/             # Shared components
    ├── api/                    # Axios instance + JWT interceptor
    └── styles/                 # Global SCSS
```

## Getting started

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL

### Backend setup

1. Update the connection string in `Backend/SprintForge/SprintForge/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=sprintforge;Username=youruser;Password=yourpassword"
}
```

2. Apply migrations:

```bash
dotnet ef database update --project Backend/SprintForge/SprintForge
```

3. Run the API:

```bash
dotnet run --project Backend/SprintForge/SprintForge
```

Or open the solution in Visual Studio and run with IIS Express (default port `44390`).

### Frontend setup

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

> If using IIS Express, make sure the base URL in `client/src/api/axios.ts` matches your backend port.

## API overview

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user info |

### Sprints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sprint` | Create sprint |
| GET | `/api/sprint/my` | List my sprints |
| GET | `/api/sprint/{id}/progress` | Sprint progress stats |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sprints/{id}/tasks` | List tasks for a sprint |
| POST | `/api/sprints/{id}/tasks` | Add task |
| PATCH | `/api/sprints/{id}/tasks/{taskId}/status` | Update task status |
| PUT | `/api/tasks/{id}` | Edit task |
| DELETE | `/api/tasks/{id}` | Delete task |

### Artifacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/{id}/artifacts` | Add artifact link |
| DELETE | `/api/artifacts/{id}` | Remove artifact |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/explore` | Browse public portfolios |
| GET | `/api/user/{id}/portfolio` | View a public portfolio |

## Roadmap

- [x] Auth (register, login, JWT)
- [x] Sprint CRUD
- [x] Task management with kanban board
- [x] Artifact links on tasks
- [x] Public explore and portfolio pages
- [ ] User profile (bio, portfolio toggle)
- [ ] AI sprint suggestions
- [ ] Mentor roles and feedback

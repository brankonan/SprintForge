# SprintForge

A sprint management and portfolio app built for student developers. Plan your work in focused sprints, track tasks on a kanban board, and share your progress through a public portfolio that others can browse.

## What it does

SprintForge gives you a simple but complete development workflow:

- Create, edit, and delete sprints with a goal, description, and date range
- Track sprint status — mark sprints as **Planned**, **Active**, or **Completed**
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
    ├── api/                    # Axios instance + JWT interceptor (401 auto-redirect)
    ├── services/               # API service layer (auth, sprint, task, artifact, user)
    ├── utils/                  # Shared utilities (formatDate, etc.)
    └── styles/                 # SCSS split into partials (_variables, _base, _auth, etc.)
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

> The frontend reads the API URL from `VITE_API_URL` in `client/.env`. Copy `.env.example` to `.env` and adjust the port if needed.

## API overview

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user info |
| PUT | `/api/auth/profile` | Update bio and portfolio visibility |

### Sprints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sprint` | Create sprint |
| GET | `/api/sprint/my` | List my sprints |
| GET | `/api/sprint/{id}/progress` | Sprint progress stats |
| PUT | `/api/sprint/{id}` | Update sprint |
| DELETE | `/api/sprint/{id}` | Delete sprint and its tasks |
| PATCH | `/api/sprint/{id}/status` | Change sprint status |

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
- [x] Sprint CRUD with status management
- [x] Protected routes and frontend auth guards
- [x] Task management with kanban board
- [x] Artifact links on tasks
- [x] Public explore and portfolio pages
- [x] User profile (bio, portfolio toggle)
- [ ] AI sprint suggestions
- [ ] Mentor roles and feedback

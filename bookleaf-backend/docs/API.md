# BookLeaf API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required | Body/Payload |
|--------|----------|-------------|---------------|--------------|
| `POST` | `/register` | Create a new user account | No | `{ email, password, fullName, role }` |
| `POST` | `/login` | Authenticate and receive JWT | No | `{ email, password }` |
| `GET` | `/me` | Get current logged-in user profile | Yes | None |

## Book & Manuscript Routes (`/books`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `POST` | `/` | Create a new draft book | Yes | `author`, `admin` |
| `PUT` | `/:id/content`| Update book manuscript/content | Yes | `author` |
| `GET` | `/my-books` | List all books by the logged-in author| Yes | `author` |
| `GET` | `/my-royalties`| Get sales and royalty analytics | Yes | `author` |
| `GET` | `/store` | List all published books | No | Any |

---

**Note on Authentication:**
For routes requiring authentication, include the JWT token in the request header:
`Authorization: Bearer <your_jwt_token>`
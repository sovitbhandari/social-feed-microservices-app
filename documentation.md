# Microservice Blog API

A simple microservice-based blog system using event-driven architecture.

---

##  Services Overview

### POSTS Service (port 4000)
- `POST /posts` — Create a new post  
- `DELETE /posts/:id` — Delete a post  
- Emits: `PostCreated`, `PostDeleted`

### COMMENTS Service (port 4001)
- `POST /posts/:id/comments` — Add a comment  
- `DELETE /posts/:postId/comments/:id` — Delete a comment  
- Emits: `CommentCreated`, `CommentDeleted`  
- Reacts to: `CommentModerated`

### MODERATION Service (port 4003)
- Reacts to: `CommentCreated`  
- Applies banned word filter  
- Emits: `CommentModerated`  

### QUERY Service (port 4002)
- `GET /posts` — Returns read model for frontend  
- Reacts to all events to maintain state  
- On boot: Replays past events from Event Bus

### EVENT BUS (port 4005)
- `POST /events` — Publish an event  
- `GET /events` — Get event history (for replay)

---

## Moderation Rules
If a comment contains any of these banned words:  
`hate`, `stupid`, `kill`, `ugly`, `racist`, `dumb`  
→ It is marked as **rejected**, otherwise **approved**.

---

## Known Limitations
- No persistent DB (in-memory only)  
- No authentication  
- Hardcoded ports  
- Not containerized yet

---

## Future Improvements
- Docker Compose support  
- MongoDB/PostgreSQL integration  
- Authentication and user profiles  
- Reactions, likes, and notifications

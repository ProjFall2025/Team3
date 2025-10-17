## API Design

### Authentication & User Management

**POST /register**  
_Request:_

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "mypassword",
  "bio": "Musician" // Optional
}
```

_Response:_

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "bio": "Musician"
}
```

**GET /validate/user**  
_Request:_

```json
{ "username": "alice", "email": "alice@example.com" } // either optional, one required
```

_Response:_

```json
{ "user": { "id": 1, "is_locked": false } }
```

**GET /validate/password**  
_Request:_

```json
{ "id": 1, "password": "mypassword" }
```

_Response:_

```json
{ "user": { "id": 1, "password": "hashed_pw", "num_failed_attempts": 0 } }
```

**GET /api/users/:id**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 1, "username": "alice", "email": "alice@example.com", "bio": "Musician", ... }
```

**PATCH /api/users/:id**  
_Role:_ User (self) or Admin  
_Request:_

```json
{
  "username": "alice2",
  "email": "alice2@example.com",
  "password": "newpassword",
  "bio": "Composer"
}
```

_Response:_

```json
{ "id": 1, "username": "alice2", ... }
```

**DELETE /api/users/:id**  
_Role:_ User (self) or Admin  
_Response:_

```json
{ "message": "User deleted", "user": { "id": 1, ... } }
```

### Sheet Music

**POST /api/sheets**  
_Role:_ Authenticated users  
_Request:_

```json
{
  "created_by": 1,
  "model": 2,
  "title": "Song Title", // Optional
  "artist": "Artist", // Optional
  "description": "Desc", // Optional
  "instrument": "Piano",
  "visibility": "public" // Optional
}
```

_Response:_

```json
{ "id": 10, "title": "Song Title", ... }
```

**GET /api/sheets/:id**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 10, "title": "Song Title", ... }
```

**PATCH /api/sheets/:id**  
_Role:_ Sheet owner or Admin  
_Request:_

```json
{
  "title": "New Title",
  "artist": "New Artist",
  "description": "Updated",
  "instrument": "Violin",
  "visibility": "private"
}
```

_Response:_

```json
{ "id": 10, "title": "New Title", ... }
```

**DELETE /api/sheets/:id**  
_Role:_ Sheet owner or Admin  
_Response:_

```json
{ "message": "Sheet deleted", "sheet": { "id": 10, ... } }
```

**POST /api/sheets/rate**  
_Role:_ Authenticated users  
_Request:_

```json
{ "user_id": 1, "sheet_id": 10, "rating": 4.5 }
```

_Response:_

```json
{ "user_id": 1, "sheet_id": 10, "rating": 4.5 }
```

### Comments

**POST /api/comments**  
_Role:_ Authenticated users  
_Request:_

```json
{ "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

_Response:_

```json
{ "id": 5, "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

**DELETE /api/comments/:id**  
_Role:_ Comment owner or Admin  
_Response:_

```json
{ "message": "Comment deleted", "comment": { "id": 5, ... } }
```

### Social Features

**POST /api/users/follow**  
_Role:_ Authenticated users  
_Request:_

```json
{ "follower": 1, "followee": 2 }
```

_Response:_

```json
{ "follower": 1, "followee": 2 }
```

**GET /api/users/following/:id**  
_Role:_ Authenticated users  
_Response:_

```json
[ { "id": 2, "username": "bob", ... }, ... ]
```

## Security Considerations

1. **Input Validation:**  
   All API endpoints validate incoming data types and required fields to prevent SQL injection and malformed requests.

2. **Password Hashing:**  
   User passwords are stored hashed (e.g., bcrypt) in the database, never in plaintext.

3. **Role-Based Access Control:**  
   Endpoints enforce user roles (admin, owner, authenticated) for sensitive actions (e.g., deleting users/sheets).

4. **HTTPS:**  
   All traffic should be served over HTTPS to encrypt data in transit.

## Performance Considerations

1. **Database Indexing:**  
   Primary keys and foreign keys are indexed. Additional indexes (e.g., on `users.username`, `sheets.title`) can be added for faster queries.

2. **API Pagination:**  
   Endpoints returning lists (e.g., sheets, users, comments) should support pagination (`limit`, `offset`) to avoid large payloads.

3. **Caching:**  
   Frequently accessed data (e.g., sheet metadata, user profiles) can be cached at the API or database level to reduce load.

## API Design

### Authentication

**POST /api/auth/register**
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

**GET /api/auth/validate/user**  
_Request:_

```json
{ "username": "alice", "email": "alice@example.com" } // either optional, one required
```

_Response:_

```json
{ "user": { "id": 1, "password": "hashed_pw", "is_locked": false } }
```

**GET /api/auth/validate/password**  
_Request:_

```json
{ "id": 1, "password": "mypassword" }
```

_Response:_

```json
{ "user": { "id": 1, "password": "hashed_pw", "num_failed_attempts": 0 } }
```

### Users

**GET /api/user/:id**  
_Role:_ Public  
_Response:_

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com",
  "bio": "Musician",
  "is_admin": false,
  "is_locked": false,
  "created_at": "...",
  "last_logged_in": "..."
}
```

**PATCH /api/user/:id**  
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

**PATCH /api/user/mkadmin/:id**  
_Role:_ Admin  
_Response:_

```json
{ "id": 1, "is_admin": true, ... }
```

**PATCH /api/user/restore/:id**  
_Role:_ Admin  
_Response:_

```json
{ "id": 1, "deleted": false, ... }
```

**DELETE /api/user/:id**  
_Role:_ User (self) or Admin  
_Response:_

```json
{ "message": "User deleted", "user": { "id": 1, ... } }
```

**POST /api/user/follow**  
_Role:_ Authenticated users  
_Request:_

```json
{ "follower": 1, "followee": 2 }
```

_Response:_

```json
{ "follower": 1, "followee": 2 }
```

**GET /api/user/:id/following**  
_Role:_ Authenticated users  
_Response:_

```json
[ { "id": 2, "username": "bob", ... }, ... ]
```

**GET /api/user/:id/sheets**  
_Role:_ Authenticated users  
_Response:_

```json
[ { "id": 10, "title": "Song Title", ... }, ... ]
```

**GET /api/user/:id/comments**  
_Role:_ Authenticated users  
_Response:_

```json
[ { "id": 5, "sheet": 10, "created_by": 1, "content": "Great sheet!" }, ... ]
```

### Sheet

**POST /api/sheet**  
_Role:_ Authenticated users  
_Request:_

```json
{
  "created_by": 1,
  "model": 2,
  "title": "Song Title",
  "artist": "Artist",
  "description": "Desc",
  "instrument": "Piano",
  "visibility": "public"
}
```

_Response:_

```json
{ "id": 10, "title": "Song Title", ... }
```

**POST /api/sheet/rate**  
_Role:_ Authenticated users  
_Request:_

```json
{ "user_id": 1, "sheet_id": 10, "rating": 4.5 }
```

_Response:_

```json
{ "user_id": 1, "sheet_id": 10, "rating": 4.5 }
```

**GET /api/sheet/:id**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 10, "title": "Song Title", ... }
```

**GET /api/sheet/:id/comments**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 5, "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

**GET /api/sheet/averages**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 10, "title": "Song Title", "avg_rating": 4.2, ... }
```

**GET /api/sheet/topten/downloads**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 10, "title": "Song Title", "num_downloads": 100, ... }
```

**GET /api/sheet/topten/averages**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 10, "title": "Song Title", "avg_rating": 4.9, ... }
```

**PATCH /api/sheet/:id**  
_Role:_ User (self) or Admin  
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

**DELETE /api/sheet/:id**  
_Role:_ User (self) or Admin  
_Response:_

```json
{ "message": "Sheet deleted", "sheet": { "id": 10, ... } }
```

### Comments

**POST /api/comment**  
_Role:_ Authenticated users  
_Request:_

```json
{ "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

_Response:_

```json
{ "id": 5, "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

**POST /api/comment/like**  
_Role:_ Authenticated users  
_Request:_

```json
{ "user_id": 1, "comment_id": 5 }
```

_Response:_

```json
{ "user_id": 1, "comment_id": 5 }
```

**DELETE /api/comment/:id**  
_Role:_ User (self) or Admin  
_Response:_

```json
{ "message": "Comment deleted", "comment": { "id": 5, ... } }
```

### Models

**GET /api/models**  
_Role:_ Authenticated users  
_Response:_

```json
{ "id": 1, "name": "ModelName", "description": "...", ... }
```

## Security Considerations

1. **Input Validation:**  
   All API endpoints that require input validate incoming data types and required fields to prevent SQL injection and malformed requests.

2. **Password Hashing:**  
   User passwords are stored hashed (bcrypt) in the database, never in plaintext.

3. **Role-Based Access Control:**  
   Endpoints enforce user roles (admin, owner, authenticated) for sensitive actions (e.g., deleting users/sheets).

4. **HTTPS:**  
   All traffic should be served over HTTPS to encrypt data in transit.

## Performance Considerations

1. **Database Indexing:**  
   Primary keys and foreign keys are indexed. Additional indexes (e.g., on `users.username`, `sheets.title`) can be added for faster queries.

2. **API Pagination:**  
   Endpoints returning lists (e.g., sheets, users, comments) should support pagination (`limit`, `offset`) to avoid large payloads.

3. **Use of Materialized Views**
   Materialized views are used frequently to prevent querying large amounts of potentially unnecessary data at once.

# **Knowtes** System Architecture and API Design

### By Michael Brukson, Anthony Nosoff, and Michael Tesis

## System Architecture Overview

Following a Model-Viewer-Controller (MVC) architecture, the back-end has the following file structure:

```
api/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── modelController.js
│   ├── sheetController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── models/
│   ├── Comment.js
│   ├── Model.js
│   ├── Sheet.js
│   └── User.js
└── routes/
    ├── auth.js
    ├── comment.js
    ├── model.js
    ├── sheet.js
    └── user.js
```

In **config**, the PostgreSQL database connection is configured. <br>
**models** defines classes corresponding to entities that form model. <br>
**routes** map end point URLs to controller actions. <br>
**controllers** handle API requests with model function calls and return responses. <br>
**middleware** handles checks on API calls such as authentication and roles.

System Architecture Diagram <br>
![System Architecture Diagram](Knowtes%20System%20Architecture%20Diagram.png)

## Technology Stack

Front-end: **React** for app interactivity, i.e. making and exploring sheets, commenting, following users

Back-end: **Node.js with Express** for app logic reflecting user actions, i.e. logging in, verifying roles, processing sheets, comments, likes

Database: **PostgreSQL** for storage of all app models (users, sheets, etc)

Authentication: **OAuth2** authentication using **JWT** tokens

Third-Party APIs: **Google** for authorization with OAuth2 (if users want to log in with Google)

## Authentication and Role-Based Access Control

#### **Roles**

There will be three main roles active:

- **Registered Users:** Require login, are able to upload their generated sheets to the site, and like and comment existing sheets

- **Administrators:** Have the ability to remove or restore sheets and their comments, in addition to all permissions of registered users

- **Guests:** Cannot upload sheets to the site; only generate sheets client-side. Can view other registered users' sheets, but not comment, like, or rate.

The roles and the actions for each role are shown in the UML Use Case Diagram below:

Use Case Diagram <br>
![Use Case Diagram](Knowtes%20Use%20Case%20Diagram.png)

Authentication is checked in the auth.js middleware file, while roles are checked in the role.js middleware file, both used in the appropriate routes.

#### **Authentication**

Authentication will be performed with **JSON Web Tokens (JWTs)**, along with **OAuth2** for optional **third-party logins through Google.** <br>
A sign-up page will direct users to input their email, a username, and a password (which is later hashed and salted) for their account. <br>
Upon sign-up, a new user object will be created in the database storing the registration information and a unique user ID. <br>
To sign in, users will input their username and password, which will then be compared to the database information. <br>
A valid token with expiration will be issued to users upon successful authentication. <br>
Users that log in with Google for the first time will automatically register with their Google account information, excluding a password.

One authentication flow for login is shown in the UML Sequence Diagram below:

UML Sequence Diagram for Authentication Process <br>
![Sequence Diagram](Knowtes%20Login%20UML%20Sequence%20Diagram.png)

## API Design

### Authentication API

**POST /api/auth/register**
_Request Body:_

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

**POST /api/auth/validate/user**  
_Request Body:_

```json
{ "username": "alice", "email": "alice@example.com" } // either optional, one required
```

_Response:_

```json
{ "user": { "id": 1, "password": "hashed_pw", "is_locked": false } }
```

**POST /api/auth/validate/password**  
_Request Body:_

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
_Request Body:_

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
_Request Body:_

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
_Request Body:_

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
_Request Body:_

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

**GET /api/sheet/:id/averages**  
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
_Request Body:_

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
_Request Body:_

```json
{ "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

_Response:_

```json
{ "id": 5, "sheet": 10, "created_by": 1, "content": "Great sheet!" }
```

**POST /api/comment/like**  
**POST /api/comment/unlike**  
_Role:_ Authenticated users  
_Request Body:_

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
   User passwords are stored hashed and salted (bcrypt) in the database, never in plaintext.

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

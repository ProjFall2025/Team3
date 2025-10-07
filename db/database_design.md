# Knowtes

## Database

### By Michael Brukson, Anthony Nosoff, and Michael Tesis

## Entities & Attributes

- **users**
  - Attributes: <br>
    id: serial <br>
    username: varchar(50) <br>
    email: varchar(50) <br>
    password: varchar(200) <br>
    is_admin: boolean <br>
    is_locked: boolean <br>
    num_failed_attempts: int <br>
    created_at: timestamp <br>
    deleted: boolean 

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id

  - Constraints <br>
    id: UNIQUE <br>
    username: NOT NULL, UNIQUE <br>
    email: NOT NULL <br>
    password: NOT NULL <br>
    deleted: NOT NULL

- **sheets**
  - Attributes: <br>
    id: serial <br>
    created_by: int <br>
    model: int <br>
    title: varchar(200) <br>
    artists: varchar(40) <br>
    description: varchar(400) <br>
    num_downloads: int <br>
    instrument: varchar(20) <br>
    musicxml: varchar <br>
    comments_enabled: boolean <br>
    visibility: enum <br>
    created_at: timestamp <br>
    updated_at: timestamp <br>
    deleted: boolean 

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id <br>
    FK: created_by, model

  - Constraints <br>
    id: UNIQUE <br>
    created_by: NOT NULL <br>
    model: NOT NULL <br>
    title: NOT NULL <br>
    artist: NOT NULL <br>
    num_downlaods: NOT NULL <br>
    instrument: NOT NULL <br>
    deleted: NOT NULL

- **comments**
  - Attributes: <br>
    id: serial <br>
    sheet: int <br>
    created_by: int <br>
    created_at: timestamp <br>
    updated_at: timestamp <br>
    content: varchar(300) <br>
    deleted: boolean 

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id <br>
    FK: sheet, created_by

  - Constraints <br>
    id: UNIQUE <br>
    sheet: NOT NULL <br>
    created_by: NOT NULL <br>
    content: NOT NULL <br>
    deleted: NOT NULL

- **models**
  - Attributes: <br>
    id: serial <br>
    name: varchar(20) <br>
    tjfs: varchar(10) <br>
    description: varchar(400) <br>
    created_at: timestamp

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id

  - Constraints <br>
    id: UNIQUE <br>
    name: NOT NULL <br>
    tjfs: NOT NULL

- **sheet_ratings**
  - Attributes: <br>
    user_id: int <br>
    sheet_id: int <br>
    rating: float <br>
    created_at: timestamp <br>
    updated_at: timestamp

  - Primary key (PK) and foreign keys (FK) <br>
    FK: user_id, sheet_id

  - Constraints <br>
    rating: NOT NULL

- **sheet_downloads**
  - Attributes: <br>
    id: serial <br>
    sheet_id: int <br>
    user_id: int <br>
    downloaded_on: timestamp

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id <br>
    FK: sheet_id, user_id

  - Constraints <br>
    id: UNIQUE <br>
    sheet_id: NOT NULL <br>
    user_id: NOT NULL

- **comment_likes**
  - Attributes: <br>
    user_id: int <br>
    comment_id: int <br>
    liked_on: timestamp

  - Primary key (PK) and foreign keys (FK) <br>
    FK: user_id, comment_id

  - Constraints <br>

  - **user_follows**
  - Attributes: <br>
    follower: int <br>
    followee: int

  - Primary key (PK) and foreign keys (FK) <br>
    FK: follower, followee

  - Constraints <br>
    follower: NOT NULL <br>
    followee: NOT NULL

- **login_attempts**
  - Attributes: <br>
    id: serial <br>
    user_id: int <br>
    ip_address: varchar(40) <br>
    attempted_on: timestamp

  - Primary key (PK) and foreign keys (FK) <br>
    PK: id <br>
    FK: user_id

  - Constraints <br>
    id: UNIQUE <br>

## ER Diagram

![alt text](Team3_dbdiagram.png)

## Database Schema

1. Audio-to-Sheet Music Transcription <br>
   Users can upload audio files (mp3/wav) and receive transcribed sheet music for a detected or specified instrument. <br>
   EPIC: Automates a complex, expert-only process, making sheet music creation accessible to all skill levels. <br>
   Alignment: Directly supports learners, composers, and teachers by simplifying transcription. <br>
   **USP**: Fast, automated, multi-instrument transcription.

2. Recent Transcriptions Dashboard <br>
   Users see their most recently transcribed audio and sheet music. <br>
   EPIC: Provides instant feedback and easy access to new work. <br>
   Alignment: Helps users track progress and revisit recent creations. <br>
   **USP**: Personalized, real-time updates. <br>

3. User Sheet Music History <br>
   Users can view all past sheet music they've transcribed. <br>
   EPIC: Builds a personal library for learning, teaching, or composing. <br>
   Alignment: Supports educational planning and creative archiving. <br>
   **USP**: Persistent, searchable user history. <br>

4. Social Following System <br>
   Users can follow other registered users. <br>
   EPIC: Fosters a music community for collaboration and inspiration. <br>
   Alignment: Connects users with similar interests, supporting networking. <br>
   **USP**: Social features tailored for musicians. <br>

5. Song Transcriber List <br>
   See all users who have transcribed a specific song. <br>
   EPIC: Encourages discovery and comparison of interpretations. <br>
   Alignment: Enables peer learning and community engagement. <br>
   **USP**: Collaborative sheet music ecosystem. <br>

6. Instrument-Based Transcription Search <br>
   View all transcriptions for a particular instrument. <br>
   EPIC: Makes it easy to find relevant sheet music for specific instruments. <br>
   Alignment: Supports targeted learning and arrangement. <br>
   **USP**: Instrument-centric search and filtering. <br>

7. Multi-Format Export (PDF, MIDI, MusicXML) <br>
   Export transcribed sheet music in various formats for printing, editing, or playback. <br>
   EPIC: Maximizes usability across devices and workflows. <br>
   Alignment: Meets diverse user needs for sharing, teaching, and performing. <br>
   **USP**: Flexible, professional-grade export options. <br>

8. Commenting and Rating System <br>
   Users can comment on and rate transcriptions to provide feedback and improve accuracy. <br>
   EPIC: Drives quality improvement and community interaction. <br>
   Alignment: Supports learning, collaboration, and continuous enhancement. <br>
   **USP**: Crowdsourced accuracy and feedback. <br>

## UML Class Diagram

### Research & Analysis

In order to refine our user's needs, the user's home page will contain an area to provide feedback, identify issues, and make recommendations for site improvement. We will analyze all of the users' feedback and make corresponding changes and enhancements as time and resources allow. We will also include a rating and comment section for each transcription in order to see our transcription's accuracy and user satisfaction.

In order to study competitors, we will first identify apps or sites similar to ours. Some of the competitors that we have already identified are AnthemScore, ScoreCloud, and Melody Scanner. Then we will compare our site's features and performance to theirs. This will include music sheet accuracy, the instruments supported, export formats, pricing, etc. Lastly we will also look at reviews left about our competitors and see if there is anything we can do better than them.

### Design – UI/UX considerations

Knowtes will feature a streamlined layout with a focus on two main aspects: **uploads** and **profiles**.<br>
The sticky **navigation bar** will make the application cohesive, including links to the following:

- Making uploads
- Exploring profiles
- Viewing your own profile
- Search
- Login
  <br><br>

Each page layout will have several key elements. <br><br>
**Upload and export page:**

- A button to upload content
- A generated dropdown menu to select the instrument to transcribe
- A horizontal (widescreen) or vertical (mobile/portrait) menu to select export type (PDF, MIDI, MusicXML)
- Additional export configuration options
- A button to export the result
  <br><br>

**Exported music elements:**

- Options to download (leading to export page)
- Favorite button
- Star rating
- Comment buttons that show a list with username, profile pic, content, and star rating (if applicable)
  <br><br>

**User profile page:**

- Profile picture, username, bio
- Upload, follower, and total favorite counts
- List view of transcribed music
- List view of favorites (if public)
  <br><br>

**Exploration page:**

- A modular grid view of songs
- Showing related/similar genre songs to previously exported ones
- Genre selection
- Trending songs view (sort by favorite)
- All song listings have profiles associated with them
  <br><br>

**Search page:**

- Main text field with live-updating results
- Option to search generally or by profile, song, or instrument
- Option to show search results as a grid or list view
  <br><br>

Knowtes will also take **accessibility measures**, such as:

- Making sure elements are high-contrast for readability
- Shifting or marking elements instead of solely using color changes to indicate importance or interactivity
- Consistent headings and element styles throughout the site
- Modular elements that can resize depending on mobile or pc navigation
- Providing the ability to export to MusicXML to accomodate to those with low vision due to its versatility

### Development

- **Frontend**
  A combination of React, TypeScript, HTML5, and CSS3 will be used. **React** will provide the framework for building the UI and managing the application state efficiently. **TypeScript** will add static typing to JavaScript, improving code maintainability. **HTML5** will structure the content and layout of the web pages. **CSS3** will handle the visual styling and responsive design, making the application look modern and work well on different devices.
- **Backend**
  Node.js, Express.js, PostgreSQL, and RESTful API routes will be used extensively in the backend. **Node.js** will provide the runtime environment for executing server-side JavaScript code, handling requests, and managing application logic. **Express.js** serves as the web application framework for Node.js, enabling routing, middleware integration, and RESTful API creation. **PostgreSQL** serves as the RDBS to store and manage sensitive user data, transcribed music sheets, and admin permissions securely. **RESTful API routes** defines the interface for communication between the frontend and backend, allowing clients to perform operations such as uploading audio, retrieving user data, updating existing data, and will even allow third party applications to leverage the utilities the site provides.
- **Other**
  External music transcription APIs/In house algorithms will allow for the transcribing of music. **JWT** may be used for 2FA.

### Testing

We will create a test plan consisting of the test cases corresponding to each use case of the site. Using these test cases we'll test the functionality, validation, and error display. The key areas to test are: authentication (site registration, login and logout), authorization (the users can only perform actions provided by their roles and permissions), user's input (format of all fields including song upload is correctly validated), the output (ability to correctly display, download, and print the music sheet and other information presented to users), and the interactions between users on the site. Additionally, we will perform load tests to make sure that the site is scalable and can accommodate the desired volume of users with an adequate response speed using software that simulates different amounts of concurrent users.

### Launch & Maintenance

Multiple development channels (alpha, beta, release) implemented as Git branches will be used to separate stable releases from experimental feature platforms and non-thoroughly-tested versions, following the test protocols above. In the event that servers for the application are not running, an automatic restart can be attempted. If failed, features such as AWS CloudWatch or its analogs can alert the team of such events. Bug reporting information will be included in application settings.

## Brief explanation of how schema supports site functionalities



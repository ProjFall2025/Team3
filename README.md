# Knowtes

## \#WhatTheSheet?!?!??

### By Michael Brukson, Anthony Nosoff, and Michael Tesis

## Our Mission

Our goal is to simplify access to sheet music by automating the transcription process. Traditionally, transcribing music requires a practiced ear and significant expertise, making it challenging for many novice musicians and enthusiasts. By using technology to transcribe music, we make music creation and enjoyment more accessible to everyone, regardless of their skills. <br>
**Let's make music more accessible.**

## Target Users

Our site will serve the following user groups:

1. **Music Students and Learners**

- _Demographics and interests_:  
  Teenagers to young adults learning how to play instruments professionally or amateurly interested in connecting the songs they enjoy to music theory.

- _What they need from our site_:  
  The sheet music created by our site for a song they want to reproduce.

- _How our site supports them_:  
  Converts audio provided by them into sheet notation. It also helps them make the connection between listening and reading music.

2. **Composers and Songwriters**

- _Demographics and interests_:  
  Adults professionally involved in the music industry at all levels who want to record original music or arrange existing music in a new way.

- _What they need from our site_:  
  The creation of separate music sheets for different instruments used in a song. Also, connection to other musicians with similar music interests.

- _How our site supports them_:  
  Automates the time consuming process of recording music into a music sheet. Separates the music sheets by the instuments used in the song. Recommends other site users that work with similar music.

3. **Music Teachers**

- _Demographics and interests_:  
  Adults that teach music publicly or privately that are interested in creating a protfolio of note sheets for songs they use for teaching.

- _What they need from our site_:  
  A free and easy way to obtain sheet music for songs they want to teach. Also, the history of the songs they requested on the site to create an educational plan and lessons.

- _How our site supports them_:  
  Converts songs to music sheets for free and stores all of the created sheets in the user's history.

## Main Features

1. Converting user provided audio into sheet music for a detected/specified instrument.
2. Seeing the most recently transcribed audio.
3. Seeing all past sheet music per user.
4. Being able to follow other users registered on the site.
5. Seeing all the users who transcribed a specific song.
6. Seeing all the transcriptions for an instrument.
7. Exporting transcribed sheet music in multiple formats (PDF, MIDI, MusicXML).
8. Commenting and rating transcriptions to provide feedback and improve accuracy.

## Preliminary Development Plan

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

The upload page will have a form layout with the following elements:
- A button to upload content
- A generated dropdown menu to select the instrument to transcribe
- A horizontal (widescreen) or vertical (mobile/portrait) menu to select export type (PDF, MIDI, MusicXML)
- Additional export configuration options
<br><br>

Knowtes will also take accessibility measures such as:
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

- Strategy for release and ongoing updates.

## Functional requirements

- Database that stores the following:
- ...
- Backend (using Node.js)

## Non-functional requirements

- External API
- Internal API

## Non-functional choices

- React Frontend
- Postgresql

## Project Description

Knowtes is a music recognition software. Users can upload an mp3 file or a wav file and the software will give the user the transcribed sheet music for that song. Alternatively, users may also request a song's transcription via its name directly; upon which the software will make an external API call for that song.

## Project Structure

## Requirements

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/ProjFall2025/Team3.git
   cd Team3
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd app
   npm install
   cd ..
   ```

4. **Build the React application**

   ```bash
   npm run build-react
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - The API endpoint is available at `http://localhost:8080/api/test`

### Development Mode

For development with hot reloading:

1. **Start the backend server** (in one terminal):

   ```bash
   npm run dev
   ```

2. **Start the React development server** (in another terminal):
   ```bash
   cd app
   npm start
   ```

The React app will run on `http://localhost:3000` and proxy API calls to the backend.

### Key Notes

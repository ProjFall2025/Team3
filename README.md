# Knowtes

## \#WhatTheSheet?!?!??

### By Michael Brukson, Anthony Nosoff, and Michael Tesis

## Our Mission

Our goal is to simplify access to sheet music by automating the transcription process. Traditionally, transcribing music requires a practiced ear and significant expertise, making it challenging for many novice musicians and enthusiasts. By using technology to transcribe music, we make music creation and enjoyment more accessible to everyone, regardless of their skills.

## Target Users

Our site will serve the following user groups:

1. **Music Students and Learners**
- *Demographics and interests*:  
Teenagers to young adults learning how to play instruments professionally or amateurly interested in connecting the songs they enjoy to music theory. 

- *What they need from our site*:  
The sheet music created by our site for a song they want to reproduce.

- *How our site supports them*:  
Converts audio provided by them into sheet notation. It also helps them make the connection between listening and reading music.

2. **Composers and Songwriters**
- *Demographics and interests*:  
Adults professionally involved in the music industry at all levels who want to record original music or arrange existing music in a new way.

- *What they need from our site*:  
The creation of separate music sheets for different instruments used in a song. Also, connection to other musicians with similar music interests.

- *How our site supports them*:  
Automates the time consuming process of recording music into a music sheet. Separates the music sheets by the instuments used in the song. Recommends other site users that work with similar music.

3. **Music Teachers**
- *Demographics and interests*:  
Adults that teach music publicly or privately that are interested in creating a protfolio of note sheets for songs they use for teaching. 

- *What they need from our site*:  
A free and easy way to obtain sheet music for songs they want to teach. Also, the history of the songs they requested on the site to create an educational plan and lessons.

- *How our site supports them*:  
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

- How you’ll refine user needs and study competitors.

### Design – UI/UX considerations

- (layout, navigation, accessibility, etc.).

### Development

- Front-end and back-end technologies you would use.

### Testing

- How you’ll test usability, performance, and security.

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

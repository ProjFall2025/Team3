# Knowtes

## \#WhatTheSheet?!?!??

### By Michael Brukson, Anthony Nosoff, and Michael Tesis

## Our Mission

We want to make it easier for everyone to get sheet music, without having to transcribe it themselves.<br>
_Especially_ if they dont have the skillset to do so, making music as a whole more accessible.

## Our Target Audience

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

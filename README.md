# Easy Note

A simple full-stack note-taking application with automatic note summarization.

## Project structure

- `client/` - React front-end application with Tailwind CSS styling and markdown summary rendering
- `server/` - Express API server with MongoDB and GROQ-based note summarization

## Features

- Create, edit, and delete summary
- Automatic summary generation using the GROQ API
- Select different summary modes (`short`, `bullet`, `detailed`, `exam`)
- Client-side markdown rendering with `react-markdown` and `remark-gfm`
- Clipboard copy for note summaries
- Toast notifications for user feedback

## Environment variables

Copy `server/.env.example` to `server/.env` and update values:

- `MONGO_URI` - MongoDB connection string
- `PORT` - Optional server port (default: `5000`)
- `GROQ_API_KEY` - GROQ API key for text summarization

## Setup

1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

2. Create your server `.env` file

```bash
cd ..
copy server\.env.example server\.env
```

3. Update `server/.env` with your MongoDB URI and GROQ API key.

## Run the project

### Server

```bash
cd server
npm run dev
```

### Client

```bash
cd client
npm start
```

## API Endpoints

- `GET /api/notes` - list all notes
- `POST /api/notes/create` - create a new note
  - request body: `{ title: string, content: string, mode?: string }`
- `PUT /api/notes/:id` - update a note
  - request body: `{ title: string, content: string }`
- `DELETE /api/notes/:id` - delete a note
- `POST /api/notes/:id/summarize` - regenerate a note summary

## Notes

- Backend URLs are currently hard-coded inside `client/src/App.js`.
- Update the API base URL in `client/src/App.js` when deploying or switching environments.
- The server uses `server/.env` for configuration; do not commit that file.
- The client uses `react-markdown` and `remark-gfm` to render note summaries.
- If you host the front end and back end separately, make sure CORS is configured correctly in `server/server.js`.

## Recommended improvements

- Move API calls into a dedicated service layer in `client/src`
- Regenerate note summaries when a note is updated
- Add validation and loading states for the note list
- Replace hard-coded backend URLs with environment variables for the React app

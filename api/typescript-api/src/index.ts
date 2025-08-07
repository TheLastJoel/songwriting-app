import express from 'express';
import dotenv from 'dotenv';
import { startSessionHandler, saveLyricsHandler, getLyricsHandler } from './handlers/handlers';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.get('/start-session', startSessionHandler); // GROK: Use POST in prod
app.post('/save-lyrics', saveLyricsHandler);
app.get('/lyrics/:userId', getLyricsHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
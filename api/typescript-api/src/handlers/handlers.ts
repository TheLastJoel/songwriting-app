import { Request, Response } from 'express';
import { createSession, saveLyrics, getLyricsForUser } from '../database/db';

// StartSessionHandler creates a new session if limit not exceeded.
export const startSessionHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10); // GROK: Use query for simplicity; auth middleware in prod
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const sessionId = await createSession(userId);
    res.json({ sessionId });
  } catch (err) {
    res.status(403).json({ error: 'Session limit exceeded or error' });
  }
};

// SaveLyricsHandler saves lyrics for a session.
export const saveLyricsHandler = async (req: Request, res: Response) => {
  const { sessionId, content } = req.body;
  if (!sessionId || !content) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    await saveLyrics(sessionId, content);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: 'Error saving lyrics' });
  }
};

// GetLyricsHandler retrieves user's lyrics.
export const getLyricsHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const lyrics = await getLyricsForUser(userId);
    res.json(lyrics);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching lyrics' });
  }
};
import request from 'supertest';
import express from 'express';
import { startSessionHandler, saveLyricsHandler } from './handlers';
import * as db from '../database/db'; // GROK: Import mocked database functions

// GROK: Mock database functions for isolation
jest.mock('../database/db');

const app = express();
app.use(express.json());
app.get('/start-session', startSessionHandler);
app.post('/save-lyrics', saveLyricsHandler);

describe('Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  test('startSessionHandler should return sessionId', async () => {
    // GROK: Mock createSession to return a session ID
    (db.createSession as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/start-session?userId=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('sessionId', 1);
    expect(db.createSession).toHaveBeenCalledWith(1);
  });

  test('saveLyricsHandler should save lyrics and return 201', async () => {
    // GROK: Mock saveLyrics to resolve successfully
    (db.saveLyrics as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/save-lyrics')
      .send({ sessionId: 1, content: 'Test lyrics' });
    expect(res.status).toBe(201);
    expect(db.saveLyrics).toHaveBeenCalledWith(1, 'Test lyrics');
  });
});
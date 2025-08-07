import { createSession, saveLyrics, getLyricsForUser } from './db';

describe('Database Functions', () => {
  // GROK: Use a test DB connection string via env or mock 'pg' for isolation
  process.env.DB_CONN_STRING = 'postgres://testuser:testpass@localhost:5432/testdb?sslmode=disable';

  test('createSession should create a session if under limit', async () => {
    const sessionId = await createSession(1); // Test user ID
    expect(sessionId).toBeGreaterThan(0);
  });

  test('createSession should throw if limit exceeded', async () => {
    await expect(createSession(1)).rejects.toThrow('Session limit exceeded');
  });

  // GROK: Add tests for saveLyrics and getLyricsForUser, inserting test data and cleaning up
});
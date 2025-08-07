import { Pool } from 'pg';
import dotenv from 'dotenv';

// GROK: Load env vars early for connection string
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
});

// GROK: Export pool for use in queries; in prod, handle connection errors more gracefully
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Example query functions for your app
// GROK: These mirror Go's; assume same schema: users (id, email), sessions (id, user_id, start_time, duration), lyrics (id, session_id, content)

// CreateSession starts a new writing session, checking the 10-minute daily limit.
export async function createSession(userId: number): Promise<number> {
  // GROK: Check total duration today
  const { rows: [row] } = await query(`
    SELECT COALESCE(SUM(duration), 0) AS total
    FROM sessions 
    WHERE user_id = $1 AND start_time >= CURRENT_DATE
  `, [userId]);

  const totalDurationToday = row?.total || 0;
  if (totalDurationToday >= 600) { // 10 minutes in seconds
    throw new Error('Session limit exceeded');
  }

  // Insert new session
  const { rows: [newSession] } = await query(`
    INSERT INTO sessions (user_id, start_time, duration) 
    VALUES ($1, NOW(), 0) 
    RETURNING id
  `, [userId]);

  return newSession.id;
}

// SaveLyrics saves lyrics for a session, updating session duration.
export async function saveLyrics(sessionId: number, content: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert lyrics
    await client.query(`
      INSERT INTO lyrics (session_id, content) 
      VALUES ($1, $2)
    `, [sessionId, content]);

    // Update session duration (placeholder: assume 600 seconds)
    await client.query(`
      UPDATE sessions SET duration = 600 WHERE id = $1
    `, [sessionId]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// GetLyricsForUser retrieves a user's lyrics.
export async function getLyricsForUser(userId: number): Promise<string[]> {
  const { rows } = await query(`
    SELECT content FROM lyrics 
    WHERE session_id IN (SELECT id FROM sessions WHERE user_id = $1)
  `, [userId]);

  return rows.map(row => row.content);
}
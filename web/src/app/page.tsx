'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import LyricsEditor from '@/components/LyricsEditor';
import TimerDisplay from '@/components/TimerDisplay';
import SubmitButton from '@/components/SubmitButton';
import WelcomeBanner from '@/components/WelcomeBanner';

export default function Home() {
  const [canStartSession, setCanStartSession] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);  // 10 minutes in seconds
  const [lyrics, setLyrics] = useState('');
  const [viewingSong, setViewingSong] = useState<{ lyrics: string; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      checkSessionEligibility();
    }
  }, [userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      // Auto-submit or enable submit
    }
    return () => clearInterval(interval);
  }, [sessionStarted, timeLeft]);

  const checkSessionEligibility = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions/check', { headers: { 'X-User-ID': userId! } });  // Your API endpoint to check if today's session is available
      if (!res.ok) throw new Error('Failed to check session');
      const { eligible } = await res.json();
      setCanStartSession(eligible);
    } catch (err) {
      toast.error('Error checking session eligibility');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const res = await fetch('/api/sessions/start', { method: 'POST', headers: { 'X-User-ID': userId! } });  // Your API to log session start
      if (!res.ok) throw new Error('Failed to start session');
      setSessionStarted(true);
      setCanStartSession(false);
    } catch (err) {
      toast.error('Error starting session');
    }
  };

  const submitLyrics = async () => {
    if (timeLeft > 0) return toast.error('Time not up yet');
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-ID': userId! },
        body: JSON.stringify({ lyrics }),
      });
      if (!res.ok) throw new Error('Failed to save song');
      toast.success('Song saved!');
      setLyrics('');
      setSessionStarted(false);
      checkSessionEligibility();  // Refresh eligibility
    } catch (err) {
      toast.error('Error saving song');
    }
  };

  // Function to display song from sidebar click (called via event or context)
  const displaySong = (song: { lyrics: string; created_at: string }) => {
    setViewingSong(song);
  };

  // In Sidebar, use a custom event or context to call displaySong on click

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-night flex flex-col items-center">
      {!sessionStarted && !viewingSong && (
        <WelcomeBanner canStart={canStartSession} onStart={startSession} />
      )}
      {sessionStarted && (
        <>
          <TimerDisplay timeLeft={timeLeft} />
          <LyricsEditor value={lyrics} onChange={setLyrics} />
          <SubmitButton onSubmit={submitLyrics} disabled={timeLeft > 0} />
        </>
      )}
      {viewingSong && (
        <div className="w-full max-w-2xl">
          <h2 className="text-lg mb-4">Viewing Song from {new Date(viewingSong.created_at).toLocaleString()}</h2>
          <pre className="whitespace-pre-wrap">{viewingSong.lyrics}</pre>
          <button onClick={() => setViewingSong(null)} className="mt-4 bg-indigo-700 p-2 rounded">Back to Editor</button>
        </div>
      )}
    </div>
  );
}
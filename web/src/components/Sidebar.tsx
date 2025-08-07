'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Song {
  id: string;
  title?: string;
  created_at: string;
  lyrics: string;
}

export default function Sidebar() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const { isOpen } = useSidebar();

  useEffect(() => {
    if (userId) {
      fetchSongs();
    }
  }, [userId]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/songs', { headers: { 'X-User-ID': userId! } });
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      toast.error('Error fetching song history');
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = (song: Song) => {
    // Swap main content to view mode (to be handled in page.tsx with state)
  };

  return (
    <aside
      className={`text-print bg-midnight w-64 p-4 flex flex-col h-screen fixed top-0 left-0 z-20 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Previous Entries</h2>
      {loading ? (
        <LoadingSpinner />
      ) : songs.length === 0 ? (
        <p>No songs yet.</p>
      ) : (
        <ul className="flex-1 overflow-auto">
          {songs.map((song) => (
            <li
              key={song.id}
              onClick={() => handleSongClick(song)}
              className="cursor-pointer mb-2"
            >
              {new Date(song.created_at).toLocaleDateString()} - {song.title || 'Untitled'}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
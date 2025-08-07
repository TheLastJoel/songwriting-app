'use client';
interface Props {
  canStart: boolean;
  onStart: () => void;
}

export default function WelcomeBanner({ canStart, onStart }: Props) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to Your Daily Songwriting Session</h2>
      <p className="mb-4">You have 10 minutes today. Make it count.</p>
      {canStart ? (
        <button onClick={onStart} className="bg-indigo-700 p-2 rounded">Start Session</button>
      ) : (
        <p>Come back tomorrow for your next session.</p>
      )}
    </div>
  );
}
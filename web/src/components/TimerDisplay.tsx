'use client';
interface Props {
  timeLeft: number;
}

export default function TimerDisplay({ timeLeft }: Props) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return <div className="text-4xl mb-4">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>;
}
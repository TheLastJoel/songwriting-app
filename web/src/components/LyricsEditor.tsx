'use client';
interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function LyricsEditor({ value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-96 bg-night text-white p-4 rounded mb-4"
      placeholder="Write your lyrics here..."
    />
  );
}
'use client';
interface Props {
  onSubmit: () => void;
  disabled: boolean;
}

export default function SubmitButton({ onSubmit, disabled }: Props) {
  return (
    <button onClick={onSubmit} disabled={disabled} className="bg-indigo-700 p-2 rounded disabled:opacity-50">
      Submit Lyrics
    </button>
  );
}
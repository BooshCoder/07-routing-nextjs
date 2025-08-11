"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
} 
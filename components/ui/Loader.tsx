"use client";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Arşiv Taranıyor..." }: LoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white/40 tracking-[0.3em] uppercase text-[10px] font-mono">
      {text}
    </div>
  );
}
"use client";

interface PageHeaderProps {
  kicker?: string;
  issue?: string;
  title: string;
  description: string;
}

export default function PageHeader({ 
  kicker = "Küresel Endeks", 
  issue = "Sayı 001", 
  title, 
  description 
}: PageHeaderProps) {
  return (
    <header className="max-w-[85rem] mx-auto w-full flex flex-col mb-16 md:mb-24 shrink-0 px-6 md:px-12">
      <div className="flex items-center gap-4 md:gap-6 mb-8 w-full">
        <span className="dergi-kicker mb-0">
          {kicker}
        </span>
        <div className="h-[1px] flex-1 bg-white/10"></div>
        <span className="dergi-kicker mb-0">
          {issue}
        </span>
      </div>

      <h1 className="text-6xl md:text-8xl font-extralight text-white tracking-widest mb-6 md:mb-8 uppercase leading-tight md:leading-none break-words">
        {title}
      </h1>
      
      <p className="dergi-body max-w-3xl">
        {description}
      </p>
    </header>
  );
}
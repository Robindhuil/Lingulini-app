"use client";

interface LanguageCardProps {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  gradient: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

export default function LanguageCard({
  code,
  name,
  nativeName,
  flag,
  gradient,
  isSelected,
  onSelect
}: LanguageCardProps) {
  return (
    <button
      onClick={() => onSelect(code)}
      className={`card-playful text-center p-8 cursor-pointer border-4 transition-all ${
        isSelected 
          ? 'border-primary scale-105' 
          : 'border-transparent hover:border-secondary'
      }`}
    >
      <div className="text-6xl mb-4 animate-bounce-subtle">{flag}</div>
      <h3 className="text-2xl font-bold mb-2 text-primary">{name}</h3>
      <p className="text-lg text-muted">{nativeName}</p>
      <div className={`mt-4 h-2 rounded-full bg-linear-to-r ${gradient}`}></div>
    </button>
  );
}

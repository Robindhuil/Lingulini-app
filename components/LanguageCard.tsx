"use client";

import { Pencil, Trash2 } from "lucide-react";

interface LanguageCardProps {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  gradient: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function LanguageCard({
  code,
  name,
  nativeName,
  flag,
  gradient,
  isSelected,
  onSelect,
  isAdmin = false,
  onEdit,
  onDelete,
}: LanguageCardProps) {
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(code)}
        className={`w-full card-playful text-center p-8 cursor-pointer border-4 transition-all ${
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

      {/* Admin Actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            title="Edit course"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            title="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

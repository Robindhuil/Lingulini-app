"use client";
import { useTranslation } from "@/app/i18n/I18nProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇬🇧',
    gradient: 'from-blue-400 to-blue-600'
  },
  // { 
  //   code: 'es', 
  //   name: 'Spanish', 
  //   nativeName: 'Español',
  //   flag: '🇪🇸',
  //   gradient: 'from-red-400 to-red-600'
  // },
  // { 
  //   code: 'fr', 
  //   name: 'French', 
  //   nativeName: 'Français',
  //   flag: '🇫🇷',
  //   gradient: 'from-purple-400 to-purple-600'
  // },
  // { 
  //   code: 'de', 
  //   name: 'German', 
  //   nativeName: 'Deutsch',
  //   flag: '🇩🇪',
  //   gradient: 'from-green-400 to-green-600'
  // },
];

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    // TODO: Navigate to learning path or save preference
    console.log('Selected language:', langCode);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Language Selection Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-primary">
          Choose Your Language Adventure! 🗣️
        </h2>
        <p className="text-center text-lg text-secondary mb-12">
          Pick a language you want to learn and start your journey
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`card-playful text-center p-8 cursor-pointer border-4 transition-all ${
                selectedLang === lang.code 
                  ? 'border-primary scale-105' 
                  : 'border-transparent hover:border-secondary'
              }`}
            >
              <div className="text-6xl mb-4 animate-bounce-subtle">{lang.flag}</div>
              <h3 className="text-2xl font-bold mb-2 text-primary">{lang.name}</h3>
              <p className="text-lg text-muted">{lang.nativeName}</p>
              <div className={`mt-4 h-2 rounded-full bg-linear-to-r ${lang.gradient}`}></div>
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-primary">
          Why Kids Love Lingulini! 💖
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-playful text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-3 text-primary">Fun Games</h3>
            <p className="text-muted">
              Learn through interactive games and challenges that make studying feel like playing!
            </p>
          </div>
          
          <div className="card-playful text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold mb-3 text-primary">Exciting Stories</h3>
            <p className="text-muted">
              Dive into magical stories and adventures while learning new words and phrases!
            </p>
          </div>
          
          <div className="card-playful text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-3 text-primary">Earn Rewards</h3>
            <p className="text-muted">
              Collect badges, unlock levels, and track your progress as you become a language master!
            </p>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="gradient-fun rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-black mb-8">Join Our Growing Community!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-black mb-2">10,000+</div>
              <div className="text-xl opacity-90">Happy Learners</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">4</div>
              <div className="text-xl opacity-90">Languages Available</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">1M+</div>
              <div className="text-xl opacity-90">Lessons Completed</div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
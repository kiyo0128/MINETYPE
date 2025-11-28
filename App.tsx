import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, WordItem, GameStats } from './types';
import { fetchWordsFromGemini } from './services/geminiService';
import { Button } from './components/Button';
import { StatusCard } from './components/StatusCard';
import { PixelCharacter, CharacterType } from './components/PixelCharacter';
import { GAME_DURATION, RANK_THRESHOLDS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [stats, setStats] = useState<GameStats>({ score: 0, correctChars: 0, missedChars: 0, maxCombo: 0 });
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Generating World...");

  // Ref for timer to clear it properly
  const timerRef = useRef<number | null>(null);

  const startGame = async () => {
    setGameState(GameState.LOADING);
    setLoadingMsg("Mining words from Gemini...");
    
    const loadedWords = await fetchWordsFromGemini();
    setWords(loadedWords);
    
    // Reset State
    setCurrentWordIndex(0);
    setInput('');
    setTimeLeft(GAME_DURATION);
    setStats({ score: 0, correctChars: 0, missedChars: 0, maxCombo: 0 });
    setCombo(0);
    
    setGameState(GameState.PLAYING);
  };

  const endGame = useCallback(() => {
    setGameState(GameState.FINISHED);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Timer Effect
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;
      
      // Prevent default behavior for some keys if necessary, but keep it simple
      if (e.key === 'Backspace') {
        // Not allowing backspace adds difficulty, but let's allow it for UX? 
        // Actually, typical typing games don't use input fields, they catch characters.
        // Let's stick to valid character input.
        return; 
      }
      
      if (e.key.length === 1 && /[a-zA-Z\-]/.test(e.key)) {
        const char = e.key.toLowerCase();
        const currentWord = words[currentWordIndex];
        const targetRomaji = currentWord.romaji;
        const nextCharIndex = input.length;

        // Check if correct char
        if (targetRomaji[nextCharIndex] === char) {
          const newInput = input + char;
          setInput(newInput);
          setStats(prev => ({ ...prev, correctChars: prev.correctChars + 1, score: prev.score + 10 + (combo * 2) }));
          setCombo(prev => {
            const newCombo = prev + 1;
            setStats(s => ({...s, maxCombo: Math.max(s.maxCombo, newCombo)}));
            return newCombo;
          });

          // Word Complete?
          if (newInput === targetRomaji) {
            // Bonus for word completion
            setStats(prev => ({ ...prev, score: prev.score + 100 }));
            // Next word
            setInput('');
            if (currentWordIndex + 1 < words.length) {
              setCurrentWordIndex(prev => prev + 1);
            } else {
              // Out of words - Regenerate or just loop? Let's loop for simplicity
              setCurrentWordIndex(0);
              // Shuffle slightly? No, keep simple.
            }
          }
        } else {
          // Mistake
          setStats(prev => ({ ...prev, missedChars: prev.missedChars + 1, score: Math.max(0, prev.score - 5) }));
          setCombo(0);
          setShake(true);
          setTimeout(() => setShake(false), 200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, input, currentWordIndex, words, combo]);

  const getRank = (score: number) => {
    for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
      if (score >= RANK_THRESHOLDS[i].score) {
        return RANK_THRESHOLDS[i];
      }
    }
    return RANK_THRESHOLDS[0];
  };

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 relative z-10">
      <div className="flex items-center gap-4 md:gap-8 mb-4">
        <div className="hidden md:block animate-bounce" style={{ animationDelay: '0s' }}>
          <PixelCharacter type="STEVE" size={80} />
        </div>
        <div>
          <h1 className="text-4xl md:text-6xl text-[#d4d4d4] font-pixel mb-2 drop-shadow-[4px_4px_0_#000]">
            MINETYPE
          </h1>
          <h2 className="text-xl md:text-2xl text-[#aaaaaa] font-bold tracking-wider drop-shadow-[2px_2px_0_#000]">
            THE BLOCKY TYPER
          </h2>
        </div>
        <div className="hidden md:block animate-bounce" style={{ animationDelay: '0.5s' }}>
          <PixelCharacter type="ALEX" size={80} />
        </div>
      </div>
      
      <div className="bg-[#c6c6c6] border-4 border-white border-b-[#555] border-r-[#555] p-8 max-w-md w-full flex flex-col gap-6 shadow-2xl relative">
        <p className="text-[#3f3f3f] text-xl font-bold">
          Type the words before the sun sets!
        </p>
        <Button onClick={startGame} className="text-xl">
          Start Game
        </Button>
      </div>
      
      {/* Decorative Mobs */}
      <div className="absolute bottom-10 left-10 opacity-80 hidden lg:block">
        <PixelCharacter type="CREEPER" size={100} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-80 hidden lg:block">
        <PixelCharacter type="ZOMBIE" size={100} />
      </div>
    </div>
  );

  const renderLoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
      <div className="animate-bounce mb-8">
         <div className="w-16 h-16 bg-green-600 border-4 border-black relative shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-green-500 opacity-50"></div>
         </div>
      </div>
      <p className="text-white text-2xl font-pixel animate-pulse drop-shadow-md">{loadingMsg}</p>
    </div>
  );

  const renderGameScreen = () => {
    if (words.length === 0) return null;
    const word = words[currentWordIndex];

    return (
      <div className="flex flex-col items-center justify-between min-h-screen py-8 px-4 w-full max-w-4xl mx-auto relative z-10">
        {/* Header Stats */}
        <div className="w-full flex justify-between gap-4 mb-8">
          <StatusCard label="Score" value={stats.score} />
          <StatusCard label="Time" value={timeLeft} />
        </div>

        {/* Main Typing Area */}
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <div className={`bg-black/70 backdrop-blur-md p-8 md:p-12 rounded-sm border-4 border-[#727272] w-full text-center relative shadow-[0_0_20px_rgba(0,0,0,0.5)] ${shake ? 'animate-shake border-red-500' : ''}`}>
             
             {/* Category Tag */}
             <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-4">
                <span className="bg-[#3e8948] text-white px-4 py-1 font-pixel text-sm border-2 border-white shadow-md">
                  {word.category}
                </span>
             </div>

             {/* Japanese Word */}
             <h2 className="text-5xl md:text-7xl text-white mb-6 font-bold drop-shadow-[4px_4px_0_#000]">
                {word.japanese}
             </h2>

             {/* Romaji Display */}
             <div className="text-4xl md:text-6xl font-mono tracking-widest break-all">
                {word.romaji.split('').map((char, idx) => {
                  let colorClass = "text-[#888]"; // darker gray for untyped
                  if (idx < input.length) {
                    // Minecraft Green for correct, Red for error (though we block errors in logic mostly, keeping styling just in case)
                    colorClass = input[idx] === char ? "text-[#55ff55] drop-shadow-[0_0_5px_rgba(85,255,85,0.8)]" : "text-red-500";
                  }
                  return (
                    <span key={idx} className={`${colorClass} transition-colors duration-75`}>
                      {char}
                    </span>
                  );
                })}
             </div>
             
             {/* Combo Indicator */}
             {combo > 1 && (
               <div className="mt-8 text-yellow-400 font-pixel text-xl animate-bounce drop-shadow-[2px_2px_0_#000]">
                 COMBO x{combo}!
               </div>
             )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-8 max-w-3xl">
           <div className="w-full h-8 bg-[#3a3a3a] border-4 border-black relative shadow-inner">
              <div 
                className="h-full bg-[#3e8948] transition-all duration-1000 ease-linear border-r-4 border-[#4aa056]"
                style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
              />
           </div>
           <p className="text-[#aaa] text-center mt-2 text-sm font-bold tracking-wide drop-shadow-md">Type the Romaji exactly as shown</p>
        </div>
      </div>
    );
  };

  const renderResultScreen = () => {
    const rank = getRank(stats.score);
    
    // Determine character based on score
    let resultChar: CharacterType = 'ZOMBIE';
    if (stats.score > 5000) resultChar = 'STEVE';
    else if (stats.score > 2500) resultChar = 'ALEX';
    else if (stats.score > 1000) resultChar = 'CREEPER';
    else if (stats.score > 500) resultChar = 'SKELETON';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#c6c6c6] border-4 border-white border-b-[#555] border-r-[#555] w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#3f3f3f] p-4 text-center border-b-4 border-[#222]">
             <h2 className="text-3xl md:text-4xl text-white font-pixel drop-shadow-[2px_2px_0_#000]">GAME OVER</h2>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
            
            {/* Character Visual */}
            <div className="flex flex-col items-center">
              <div className="bg-[#8b8b8b] p-4 border-4 border-black/20 rounded shadow-inner mb-2">
                <PixelCharacter type={resultChar} size={128} />
              </div>
              <p className="text-[#3f3f3f] font-bold mt-2">
                {resultChar === 'STEVE' || resultChar === 'ALEX' ? 'Great Job!' : 'Nice Try!'}
              </p>
            </div>

            {/* Stats */}
            <div className="flex-grow w-full space-y-4">
               <div className="text-center md:text-left">
                  <span className="block text-[#555] text-sm uppercase font-bold mb-1">Total Score</span>
                  <span className="block text-5xl text-black font-pixel leading-none">{stats.score}</span>
               </div>

               <div className="w-full bg-[#a0a0a0] p-4 border-2 border-[#555] border-b-white border-r-white space-y-2">
                  <div className="flex justify-between items-center border-b border-[#888] pb-1">
                      <span className="text-[#222] font-bold">Rank</span>
                      <span className={`font-pixel text-lg ${rank.color} drop-shadow-[1px_1px_0_#000]`}>{rank.title}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#888] pb-1">
                      <span className="text-[#222]">Max Combo</span>
                      <span className="font-mono text-xl">{stats.maxCombo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-[#222]">Accuracy</span>
                      <span className="font-mono text-xl">
                        {stats.correctChars + stats.missedChars > 0 
                          ? Math.round((stats.correctChars / (stats.correctChars + stats.missedChars)) * 100) 
                          : 0}%
                      </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-[#b0b0b0] border-t-4 border-[#999] flex gap-4">
            <Button onClick={startGame} fullWidth className="text-lg">Play Again</Button>
            <Button onClick={() => setGameState(GameState.MENU)} variant="secondary" fullWidth className="bg-[#888] text-lg">Menu</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dirt selection:bg-green-500 selection:text-white relative font-vt323">
      {/* Background Overlay for depth */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      
      {gameState === GameState.MENU && renderStartScreen()}
      {gameState === GameState.LOADING && renderLoadingScreen()}
      {gameState === GameState.PLAYING && renderGameScreen()}
      {/* Result is an overlay, but we render it conditionally. 
          If we want background to persist, we would need to not unmount game screen, 
          but for simplicity, we treat it as a separate view or just overlay on dirt. */}
      {gameState === GameState.FINISHED && renderResultScreen()}
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Zap, Trophy, Clock, Target, User, BarChart3, Sparkles, Brain, Award, RefreshCw, Loader } from 'lucide-react';

export default function QuantumQuestDemo() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [score, setScore] = useState(0);
  const [stability, setStability] = useState(100);
  const [timeLeft, setTimeLeft] = useState(45);
  const [attempts, setAttempts] = useState(3);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [dimensionLevel, setDimensionLevel] = useState(1);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [particles, setParticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, gameState, loading]);

  // Particle effect generator
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };
    
    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch puzzle from Heart Game API
  const fetchPuzzle = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const response = await fetch('https://marcconrad.com/uob/heart/api.php?out=json');
      const data = await response.json();
      
      setCurrentPuzzle({
        imageUrl: data.question,
        solution: parseInt(data.solution),
        carrots: data.carrots,
        id: Date.now()
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('API Error:', error);
      setApiError(true);
      setLoading(false);
      return false;
    }
  };

  const startGame = async () => {
    setGameState('playing');
    setTimeLeft(45);
    setAttempts(3);
    setUserAnswer('');
    setFeedback('');
    const success = await fetchPuzzle();
    if (!success) {
      setFeedback('⚠️ Unable to connect to Quantum Network. Please try again.');
    }
  };

  const handleAnswer = () => {
    if (!userAnswer || userAnswer === '') return;
    
    const numAnswer = parseInt(userAnswer);
    
    if (numAnswer === currentPuzzle.solution) {
      const timeBonus = Math.floor(timeLeft * 2);
      const streakBonus = streak * 25;
      const newScore = score + 150 + timeBonus + streakBonus;
      const newStreak = streak + 1;
      
      setScore(newScore);
      setStability(Math.min(100, stability + 15));
      setStreak(newStreak);
      
      if (newStreak > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 2000);
      }
      
      setFeedback(`✓ Correct! The answer is ${currentPuzzle.solution}! +${150 + timeBonus + streakBonus} points!`);
      setPuzzlesSolved(puzzlesSolved + 1);
      
      setTimeout(() => {
        if (puzzlesSolved + 1 >= 3) {
          setDimensionLevel(dimensionLevel + 1);
          setPuzzlesSolved(0);
          setGameState('results');
        } else {
          startGame();
        }
      }, 3000);
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setStability(Math.max(0, stability - 20));
      setStreak(0);
      
      if (newAttempts > 0) {
        setFeedback(`✗ Incorrect! ${newAttempts} attempts remaining. Try again!`);
        setUserAnswer('');
      } else {
        setFeedback(`✗ Out of attempts! The correct answer was ${currentPuzzle.solution}`);
        setTimeout(() => setGameState('results'), 3000);
      }
    }
  };

  const handleTimeout = () => {
    setFeedback(`⏰ Time's up! The answer was ${currentPuzzle.solution}. Moving on...`);
    setStability(Math.max(0, stability - 25));
    setStreak(0);
    setTimeout(() => startGame(), 3000);
  };

  const resetGame = () => {
    setScore(0);
    setStability(100);
    setDimensionLevel(1);
    setPuzzlesSolved(0);
    setStreak(0);
    setGameState('menu');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !feedback && userAnswer) {
      handleAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-6 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Combo Notification */}
      {showCombo && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-2xl font-black text-4xl shadow-2xl border-4 border-white">
            🔥 {streak}x COMBO! 🔥
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(147, 51, 234, 0.5); }
          50% { border-color: rgba(6, 182, 212, 0.8); }
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 relative z-10" style={{ animation: 'slide-up 0.6s ease-out' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-30"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-lg px-6 py-4 border border-cyan-500/30">
              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 tracking-tight">
                QuantumQuest
              </h1>
              <p className="text-purple-300 text-sm font-semibold tracking-wide">THE HEART GAME CHALLENGE</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {streak > 0 && (
              <div className="bg-gradient-to-br from-orange-500 to-red-500 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-yellow-400/50 shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                  <div>
                    <div className="text-xs text-yellow-100 font-bold">STREAK</div>
                    <div className="text-xl font-black text-white">{streak}x</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-yellow-400/40 shadow-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-xs text-yellow-300 font-semibold">Score</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    {score.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-cyan-400/40 shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="text-xs text-cyan-300 font-semibold">Stability</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    {stability}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {gameState === 'menu' && (
          <div className="space-y-6" style={{ animation: 'slide-up 0.8s ease-out' }}>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 text-center">
                <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-1 rounded-full text-sm font-bold text-cyan-300 mb-4 border border-cyan-400/30">
                  🌌 Powered by Heart Game API
                </div>
                <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Solve Visual Pattern Puzzles
                </h2>
                <p className="text-lg text-purple-200 mb-3 max-w-2xl mx-auto">
                  Decode mathematical patterns from Heart Game API puzzles and maintain dimensional stability
                </p>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                  <Brain className="w-5 h-5 text-purple-300" />
                  <span className="text-sm font-semibold">Current Dimension: </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Level {dimensionLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={startGame}
                className="relative group card-hover bg-gradient-to-br from-cyan-600 to-purple-600 p-8 rounded-2xl transition-all shadow-xl border-2 border-cyan-400/50 overflow-hidden"
                style={{ animation: 'slide-up 1s ease-out 0.1s backwards' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-all"></div>
                <div className="relative z-10">
                  <Zap className="w-12 h-12 mb-3 mx-auto text-yellow-300 drop-shadow-lg" />
                  <div className="font-black text-2xl mb-2">Start Exploration</div>
                  <div className="text-sm text-cyan-100 font-medium">Fetch puzzle from API</div>
                </div>
              </button>

              <button className="card-hover bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 p-8 rounded-2xl transition-all border border-purple-400/20 hover:border-purple-400/40 shadow-lg" style={{ animation: 'slide-up 1s ease-out 0.2s backwards' }}>
                <BarChart3 className="w-12 h-12 mb-3 mx-auto text-purple-400" />
                <div className="font-black text-2xl mb-2">Dimensional Archive</div>
                <div className="text-sm text-purple-300 font-medium">View past explorations</div>
              </button>

              <button className="card-hover bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 p-8 rounded-2xl transition-all border border-purple-400/20 hover:border-purple-400/40 shadow-lg" style={{ animation: 'slide-up 1s ease-out 0.3s backwards' }}>
                <Trophy className="w-12 h-12 mb-3 mx-auto text-yellow-400" />
                <div className="font-black text-2xl mb-2">Quantum Leaderboard</div>
                <div className="text-sm text-purple-300 font-medium">Global rankings</div>
              </button>

              <button className="card-hover bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 p-8 rounded-2xl transition-all border border-purple-400/20 hover:border-purple-400/40 shadow-lg" style={{ animation: 'slide-up 1s ease-out 0.4s backwards' }}>
                <User className="w-12 h-12 mb-3 mx-auto text-cyan-400" />
                <div className="font-black text-2xl mb-2">Explorer Profile</div>
                <div className="text-sm text-purple-300 font-medium">Manage your settings</div>
              </button>
            </div>

            {/* How to Play */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-lg" style={{ animation: 'slide-up 1s ease-out 0.5s backwards' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">How to Play</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-3 bg-purple-800/20 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="text-purple-100">Analyze visual puzzles from the Heart Game API</p>
                </div>
                <div className="flex items-start gap-3 bg-purple-800/20 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="text-purple-100">Find the pattern and enter the correct number</p>
                </div>
                <div className="flex items-start gap-3 bg-purple-800/20 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p className="text-purple-100">Build streaks for massive combo bonuses!</p>
                </div>
                <div className="flex items-start gap-3 bg-purple-800/20 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <p className="text-purple-100">Solve 3 puzzles to advance to next dimension</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="relative" style={{ animation: 'slide-up 0.6s ease-out' }}>
            <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30 shadow-2xl">
              {/* Puzzle Header */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div className="flex gap-3">
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/50 to-blue-600/50 border border-cyan-400/40 font-bold text-sm backdrop-blur-sm">
                    Heart Puzzle #{currentPuzzle?.id}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/50 to-purple-600/50 border border-indigo-400/40 font-bold text-sm backdrop-blur-sm">
                    Puzzle {puzzlesSolved + 1}/3
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                    timeLeft < 15 ? 'bg-red-500/30 border-2 border-red-400 animate-pulse' : 'bg-cyan-500/20 border border-cyan-400/40'
                  }`}>
                    <Clock className="w-6 h-6 text-cyan-300" />
                    <span className={`text-2xl ${timeLeft < 15 ? 'text-red-300' : 'text-cyan-200'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-400/40 font-bold">
                    <Target className="w-6 h-6 text-yellow-300" />
                    <span className="text-2xl text-yellow-200">{attempts}</span>
                  </div>
                </div>
              </div>

              {/* Stability Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-purple-200">Dimensional Stability</span>
                  <span className="text-xl font-black">{stability}%</span>
                </div>
                <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-purple-400/30">
                  <div
                    className={`h-full transition-all duration-500 relative ${
                      stability > 70 ? 'bg-gradient-to-r from-green-400 to-cyan-400' :
                      stability > 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                      'bg-gradient-to-r from-red-400 to-pink-400'
                    }`}
                    style={{ 
                      width: `${stability}%`,
                      boxShadow: stability > 70 ? '0 0 20px rgba(34, 197, 94, 0.6)' : 
                                 stability > 40 ? '0 0 20px rgba(251, 146, 60, 0.6)' :
                                 '0 0 20px rgba(244, 63, 94, 0.6)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Puzzle Image */}
              {loading ? (
                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-12 mb-6 border-2 border-purple-400/40 text-center">
                  <Loader className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-spin" />
                  <p className="text-xl font-bold text-purple-200">Fetching puzzle from Quantum Network...</p>
                  <p className="text-sm text-purple-300 mt-2">Connecting to Heart Game API</p>
                </div>
              ) : currentPuzzle && !apiError ? (
                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-6 mb-6 border-2 border-purple-400/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-6 h-6 text-purple-300" />
                      <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Analyze the Pattern</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 mb-4 flex items-center justify-center" style={{ minHeight: '300px' }}>
                      <img 
                        src={currentPuzzle.imageUrl} 
                        alt="Puzzle" 
                        className="max-w-full max-h-96 rounded-lg shadow-2xl"
                        style={{ animation: 'slide-up 0.5s ease-out' }}
                      />
                    </div>
                    <p className="text-center text-purple-200 text-sm">
                      What number do you see in this pattern?
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/30 rounded-xl p-8 mb-6 border-2 border-red-400/40 text-center">
                  <p className="text-xl font-bold text-red-200 mb-2">⚠️ Quantum Network Error</p>
                  <p className="text-sm text-red-300">Unable to fetch puzzle from Heart Game API</p>
                  <button 
                    onClick={startGame}
                    className="mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-2 rounded-lg font-bold"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Try Again
                  </button>
                </div>
              )}

              {/* Answer Input */}
              {!loading && currentPuzzle && !apiError && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-purple-200 mb-3">Enter Your Answer:</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!!feedback}
                      placeholder="Enter a number..."
                      className="flex-1 bg-slate-900/50 border-2 border-purple-400/40 rounded-lg px-6 py-4 text-2xl font-bold text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
                    />
                    <button
                      onClick={handleAnswer}
                      disabled={!!feedback || !userAnswer}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-8 py-4 rounded-lg font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div 
                  className={`p-5 rounded-xl text-center font-bold text-lg border-2 ${
                    feedback.includes('Correct') || feedback.includes('✓') ? 'bg-green-500/20 text-green-200 border-green-400/50 shadow-lg shadow-green-500/30' :
                    feedback.includes('Time') || feedback.includes('⏰') ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/50' :
                    'bg-red-500/20 text-red-200 border-red-400/50 shadow-lg shadow-red-500/30'
                  }`}
                  style={{ animation: 'slide-up 0.3s ease-out' }}
                >
                  {feedback}
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'results' && (
          <div className="relative" style={{ animation: 'slide-up 0.6s ease-out' }}>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-10 border border-purple-400/30 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-7xl mb-6 animate-bounce">
                  {stability > 50 ? '🌟' : '⚠️'}
                </div>
                <h2 className="text-5xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {stability > 50 ? 'Dimension Cleared!' : 'Reality Destabilized'}
                </h2>
                
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border-2 border-yellow-400/40">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                    <div className="text-5xl font-black text-yellow-300 mb-2">{score.toLocaleString()}</div>
                    <div className="text-sm text-yellow-200 font-semibold uppercase tracking-wider">Final Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border-2 border-cyan-400/40">
                    <Zap className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                    <div className="text-5xl font-black text-cyan-300 mb-2">{stability}%</div>
                    <div className="text-sm text-cyan-200 font-semibold uppercase tracking-wider">Stability</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border-2 border-purple-400/40">
                    <Award className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <div className="text-5xl font-black text-purple-300 mb-2">{dimensionLevel}</div>
                    <div className="text-sm text-purple-200 font-semibold uppercase tracking-wider">Dimension</div>
                  </div>
                </div>

                <div className="bg-purple-900/30 rounded-xl p-6 mb-8 border border-purple-400/30">
                  <p className="text-xl text-purple-100 font-semibold">
                    {stability > 70 ? '⭐ Exceptional pattern recognition! You\'re a quantum master!' :
                     stability > 40 ? '👍 Solid performance! Keep practicing those visual puzzles.' :
                     '💪 Every puzzle makes you stronger. Try again, Explorer!'}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="card-hover bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-10 py-4 rounded-xl font-black text-lg transition-all transform shadow-xl border-2 border-cyan-400/50"
                  >
                    Continue Exploring →
                  </button>
                  <button
                    onClick={resetGame}
                    className="card-hover bg-slate-800/50 hover:bg-slate-700/70 px-10 py-4 rounded-xl font-bold text-lg transition-all border border-purple-400/30 hover:border-purple-400"
                  >
                    ← Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-10 text-center relative z-10">
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg px-6 py-3 inline-block border border-purple-400/20">
          <p className="text-purple-300 text-sm font-medium">
            ⚡ Powered by <span className="text-cyan-400 font-bold">Heart Game API</span> • Real-time puzzle fetching • Distributed service architecture
          </p>
        </div>
      </div>
    </div>
  );
}

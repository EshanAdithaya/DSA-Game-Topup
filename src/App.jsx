import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import MenuPage        from './pages/MenuPage';
import PlayingPage     from './pages/PlayingPage';
import HeartPuzzlePage from './pages/HeartPuzzlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage     from './pages/ProfilePage';
import GameOverPage    from './pages/GameOverPage';

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route path="/menu" element={
            <ProtectedRoute><MenuPage /></ProtectedRoute>
          } />
          <Route path="/play" element={
            <ProtectedRoute><PlayingPage /></ProtectedRoute>
          } />
          <Route path="/heart-puzzle" element={
            <ProtectedRoute><HeartPuzzlePage /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/game-over" element={
            <ProtectedRoute><GameOverPage /></ProtectedRoute>
          } />

          {/* Default — go to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

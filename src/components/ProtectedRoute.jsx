import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

/**
 * Redirects unauthenticated users to /login.
 * Wrap any route that requires a logged-in user.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useGame();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

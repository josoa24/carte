import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Hello World!</h1>
        <button onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Bienvenue, {user?.username}! 🎉</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>ID:</strong> {user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

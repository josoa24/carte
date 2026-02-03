import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FirebaseSyncButton from './FirebaseSyncButton';
import './Sidebar.css';

interface SidebarProps {
  activeTab?: 'list' | 'create' | 'edit';
  onTabChange?: (tab: 'list' | 'create' | 'edit') => void;
  userCount?: number;
  onSyncComplete?: () => void;
}

const Sidebar = ({ activeTab, onTabChange, userCount, onSyncComplete }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && <span className="logo-text">Manager</span>}
          <span className="logo-icon">📊</span>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Ouvrir' : 'Fermer'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
          title="Tableau de bord"
        >
          <i className="bx bx-home"></i>
          {!isCollapsed && <span className="sidebar-label">Dashboard</span>}
        </button>

        <button
          className={`sidebar-item ${isActive('/users') ? 'active' : ''}`}
          onClick={() => navigate('/users')}
          title="Gestion des utilisateurs"
        >
          <i className="bx bx-user"></i>
          {!isCollapsed && (
            <>
              <span className="sidebar-label">Utilisateurs</span>
              {userCount !== undefined && <span className="sidebar-badge">{userCount}</span>}
            </>
          )}
        </button>

        <button
          className={`sidebar-item ${isActive('/signalements') ? 'active' : ''}`}
          onClick={() => navigate('/signalements')}
          title="Gestion des signalements"
        >
          <i className="bx bx-error-circle"></i>
          {!isCollapsed && <span className="sidebar-label">Signalements</span>}
        </button>

        <button
          className={`sidebar-item ${isActive('/carte') ? 'active' : ''}`}
          onClick={() => navigate('/carte')}
          title="Carte des signalements"
        >
          <i className="bx bx-map"></i>
          {!isCollapsed && <span className="sidebar-label">Carte</span>}
        </button>

        <div className="sidebar-divider"></div>

        {!isCollapsed && (
          <div className="sidebar-sync">
            <FirebaseSyncButton onSyncComplete={onSyncComplete} />
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-item"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          title="Déconnexion"
        >
          <i className="bx bx-log-out"></i>
          {!isCollapsed && <span className="sidebar-label">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

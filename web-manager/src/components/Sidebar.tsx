import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  activeTab: 'list' | 'create' | 'edit';
  onTabChange: (tab: 'list' | 'create' | 'edit') => void;
  userCount: number;
}

const Sidebar = ({ activeTab, onTabChange, userCount }: SidebarProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && <span className="logo-text">Gestion Users</span>}
          <span className="logo-icon">👥</span>
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
          className={`sidebar-item ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => onTabChange('list')}
          title="Liste des utilisateurs"
        >
          <span className="sidebar-icon">👥</span>
          {!isCollapsed && (
            <>
              <span className="sidebar-label">Utilisateurs</span>
              <span className="sidebar-badge">{userCount}</span>
            </>
          )}
        </button>

        <button
          className={`sidebar-item ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => onTabChange('create')}
          title="Créer un utilisateur"
        >
          <span className="sidebar-icon">➕</span>
          {!isCollapsed && <span className="sidebar-label">Nouveau</span>}
        </button>

        <div className="sidebar-divider"></div>

        <button
          className="sidebar-item"
          onClick={() => navigate('/dashboard')}
          title="Tableau de bord"
        >
          <span className="sidebar-icon">📊</span>
          {!isCollapsed && <span className="sidebar-label">Dashboard</span>}
        </button>

        <button
          className="sidebar-item"
          onClick={() => navigate('/carte')}
          title="Carte des signalements"
        >
          <span className="sidebar-icon">🗺️</span>
          {!isCollapsed && <span className="sidebar-label">Carte</span>}
        </button>

        <button
          className="sidebar-item"
          onClick={() => alert('Statistiques à venir...')}
          title="Statistiques"
        >
          <span className="sidebar-icon">📈</span>
          {!isCollapsed && <span className="sidebar-label">Statistiques</span>}
        </button>

        <button
          className="sidebar-item"
          onClick={() => alert('Paramètres à venir...')}
          title="Paramètres"
        >
          <span className="sidebar-icon">⚙️</span>
          {!isCollapsed && <span className="sidebar-label">Paramètres</span>}
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-item"
          onClick={() => window.open('https://github.com', '_blank')}
          title="Aide"
        >
          <span className="sidebar-icon">❓</span>
          {!isCollapsed && <span className="sidebar-label">Aide</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

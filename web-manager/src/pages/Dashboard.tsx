import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { User, RegisterData, UpdateUserData } from '../services/api';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';

// Palette de couleurs professionnelle et minimaliste
const colors = {
  primary: '#2c3e50',      // Bleu-gris foncé
  secondary: '#34495e',    // Gris-bleu
  accent: '#3498db',       // Bleu clair pour accents
  success: '#27ae60',      // Vert sobre
  danger: '#e74c3c',       // Rouge sobre
  warning: '#f39c12',      // Orange sobre
  light: '#ecf0f1',        // Gris très clair
  white: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  border: '#bdc3c7',
};

// Styles inline
const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    background: colors.light,
    padding: 0,
    margin: 0,
    position: 'relative' as const,
  },
  dashboardMain: {
    marginLeft: '260px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: colors.light,
    transition: 'margin-left 0.3s ease',
    position: 'relative' as const,
    zIndex: 1,
    width: 'calc(100% - 260px)',
  },
  dashboardHeader: {
    background: colors.white,
    padding: '1.25rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    borderBottom: `1px solid ${colors.border}`,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: colors.text,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  headerSubtitle: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.875rem',
    color: colors.textLight,
    fontWeight: 400,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    background: colors.light,
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
  },
  userIcon: {
    fontSize: '1.5rem',
    color: colors.primary,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  userName: {
    fontWeight: 600,
    color: colors.text,
    fontSize: '0.875rem',
  },
  userRole: {
    fontSize: '0.75rem',
    color: colors.textLight,
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
  btnLogout: {
    background: colors.danger,
    color: colors.white,
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  alert: {
    margin: '1rem 2rem',
    padding: '1rem 1.5rem',
    borderRadius: '6px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  alertError: {
    background: '#fadbd8',
    color: colors.danger,
    borderLeft: `4px solid ${colors.danger}`,
  },
  alertSuccess: {
    background: '#d5f4e6',
    color: colors.success,
    borderLeft: `4px solid ${colors.success}`,
  },
  dashboardContent: {
    background: colors.white,
    margin: '0 2.5rem 2.5rem 2.5rem',
    borderRadius: '8px',
    padding: '2rem',
    minHeight: '500px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    border: `1px solid ${colors.border}`,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: 0,
    color: colors.text,
    fontSize: '1.25rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  btnRefresh: {
    background: colors.primary,
    color: colors.white,
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  userCard: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  userCardHeader: {
    padding: '1.5rem',
    background: colors.primary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: colors.white,
    color: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 600,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userInfo: {
    flex: 1,
  },
  userInfoTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  userEmail: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.8125rem',
    opacity: 0.95,
  },
  userBadges: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    alignItems: 'flex-end',
  },
  badge: {
    padding: '0.25rem 0.625rem',
    borderRadius: '6px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  },
  badgeAdmin: {
    background: colors.warning,
    color: colors.white,
  },
  badgeUser: {
    background: colors.secondary,
    color: colors.white,
  },
  badgeLocked: {
    background: colors.danger,
    color: colors.white,
  },
  badgeDisabled: {
    background: colors.textLight,
    color: colors.white,
  },
  userCardBody: {
    padding: '1.5rem',
    background: colors.light,
  },
  userDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.625rem 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  userDetailLabel: {
    fontWeight: 600,
    color: colors.textLight,
    fontSize: '0.8125rem',
  },
  userDetailValue: {
    color: colors.text,
    fontSize: '0.8125rem',
  },
  userCardActions: {
    padding: '1rem 1.5rem',
    background: colors.white,
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  btnAction: {
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    fontSize: '0.8125rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  btnEdit: {
    background: colors.accent,
    color: colors.white,
  },
  btnUnlock: {
    background: colors.success,
    color: colors.white,
  },
  btnDelete: {
    background: colors.danger,
    color: colors.white,
  },
  formCard: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  formTitle: {
    margin: '0 0 2rem 0',
    color: colors.text,
    fontSize: '1.25rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  formLabel: {
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: colors.text,
    fontSize: '0.875rem',
  },
  formInput: {
    padding: '0.625rem 0.875rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    color: colors.text,
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    background: colors.accent,
    color: colors.white,
    border: 'none',
    padding: '0.625rem 1.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  btnSecondary: {
    background: colors.secondary,
    color: colors.white,
    border: 'none',
    padding: '0.625rem 1.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: colors.textLight,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: colors.textLight,
    fontSize: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
  },
};

// Données statiques des utilisateurs
const STATIC_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'ADMIN',
    enabled: true,
    locked: false,
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-20T14:22:00',
  },
  {
    id: 2,
    username: 'josoa',
    email: 'josoa@example.com',
    firstName: 'Josoa',
    lastName: 'Rakoto',
    role: 'USER',
    enabled: true,
    locked: false,
    createdAt: '2024-01-16T09:15:00',
    updatedAt: '2024-01-19T11:45:00',
  },
  {
    id: 3,
    username: 'marie',
    email: 'marie.martin@example.com',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'USER',
    enabled: true,
    locked: true,
    createdAt: '2024-01-18T14:20:00',
    updatedAt: '2024-01-20T16:30:00',
  },
  {
    id: 4,
    username: 'pierre',
    email: 'pierre.durand@example.com',
    firstName: 'Pierre',
    lastName: 'Durand',
    role: 'USER',
    enabled: false,
    locked: false,
    createdAt: '2024-01-10T08:45:00',
    updatedAt: '2024-01-18T10:15:00',
  },
  {
    id: 5,
    username: 'sophie',
    email: 'sophie.bernard@example.com',
    firstName: 'Sophie',
    lastName: 'Bernard',
    role: 'ADMIN',
    enabled: true,
    locked: false,
    createdAt: '2024-01-12T11:00:00',
    updatedAt: '2024-01-20T09:30:00',
  },
  {
    id: 6,
    username: 'lucas',
    email: 'lucas.petit@example.com',
    firstName: 'Lucas',
    lastName: 'Petit',
    role: 'USER',
    enabled: true,
    locked: false,
    createdAt: '2024-01-14T15:30:00',
    updatedAt: '2024-01-19T13:20:00',
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(STATIC_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [createForm, setCreateForm] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  const [editForm, setEditForm] = useState<UpdateUserData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const fetchUsers = () => {
    setUsers([...STATIC_USERS]);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newUser: User = {
        id: users.length + 1,
        username: createForm.username,
        email: createForm.email,
        firstName: createForm.firstName || '',
        lastName: createForm.lastName || '',
        role: 'USER',
        enabled: true,
        locked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      setSuccess('Utilisateur créé avec succès!');
      setCreateForm({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? {
              ...u,
              email: editForm.email || u.email,
              firstName: editForm.firstName || u.firstName,
              lastName: editForm.lastName || u.lastName,
              updatedAt: new Date().toISOString(),
            }
          : u
      );
      setUsers(updatedUsers);
      setSuccess('Utilisateur modifié avec succès!');
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
        setSelectedUser(null);
      }, 2000);
    } catch (err: any) {
      setError('Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockUser = (username: string) => {
    if (!window.confirm(`Débloquer l'utilisateur ${username}?`)) return;

    try {
      setLoading(true);
      const updatedUsers = users.map(u =>
        u.username === username
          ? { ...u, locked: false, updatedAt: new Date().toISOString() }
          : u
      );
      setUsers(updatedUsers);
      setSuccess(`Utilisateur ${username} débloqué avec succès!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Erreur lors du déblocage');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: number, username: string) => {
    if (!window.confirm(`Supprimer l'utilisateur ${username}?`)) return;

    try {
      setLoading(true);
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      setSuccess('Utilisateur supprimé avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setEditForm({
      email: userToEdit.email,
      firstName: userToEdit.firstName || '',
      lastName: userToEdit.lastName || '',
      password: '',
    });
    setActiveTab('edit');
  };

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userCount={users.length}
      />

      <div style={styles.dashboardMain}>
        <div style={styles.dashboardHeader}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>
              <i className='bx bxs-dashboard'></i>
              Tableau de bord
            </h1>
            <p style={styles.headerSubtitle}>Gestion des utilisateurs</p>
          </div>
          <div style={styles.headerRight}>
            {user ? (
              <>
                <div style={styles.userBadge}>
                  <i className='bx bx-user' style={styles.userIcon}></i>
                  <div style={styles.userDetails}>
                    <span style={styles.userName}>{user.username}</span>
                    <span style={styles.userRole}>{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} style={styles.btnLogout}>
                  <i className='bx bx-log-out'></i>
                  Déconnexion
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} style={styles.btnLogout}>
                <i className='bx bx-log-in'></i>
                Se connecter
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{...styles.alert, ...styles.alertError}}>
            <i className='bx bx-error-circle'></i>
            {error}
          </div>
        )}
        {success && (
          <div style={{...styles.alert, ...styles.alertSuccess}}>
            <i className='bx bx-check-circle'></i>
            {success}
          </div>
        )}

        <div style={styles.dashboardContent}>
          {activeTab === 'list' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <i className='bx bx-group'></i>
                  Utilisateurs ({users.length})
                </h2>
                <button onClick={fetchUsers} style={styles.btnRefresh} disabled={loading}>
                  <i className='bx bx-refresh'></i>
                  Actualiser
                </button>
              </div>

              {loading && (
                <div style={styles.loading}>
                  <i className='bx bx-loader-alt bx-spin' style={{fontSize: '2rem'}}></i>
                  <span>Chargement...</span>
                </div>
              )}

              <div style={styles.usersGrid}>
                {users.map((u) => (
                  <div key={u.id} style={styles.userCard}>
                    <div style={styles.userCardHeader}>
                      <div style={styles.userAvatar}>{u.username.charAt(0).toUpperCase()}</div>
                      <div style={styles.userInfo}>
                        <h3 style={styles.userInfoTitle}>{u.username}</h3>
                        <p style={styles.userEmail}>{u.email}</p>
                      </div>
                      <div style={styles.userBadges}>
                        <span style={{...styles.badge, ...(u.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeUser)}}>{u.role}</span>
                        {u.locked && <span style={{...styles.badge, ...styles.badgeLocked}}>Bloqué</span>}
                        {!u.enabled && <span style={{...styles.badge, ...styles.badgeDisabled}}>Désactivé</span>}
                      </div>
                    </div>

                    <div style={styles.userCardBody}>
                      <div style={styles.userDetail}>
                        <span style={styles.userDetailLabel}>Nom complet:</span>
                        <span style={styles.userDetailValue}>{u.firstName} {u.lastName || 'N/A'}</span>
                      </div>
                      <div style={styles.userDetail}>
                        <span style={styles.userDetailLabel}>Créé le:</span>
                        <span style={styles.userDetailValue}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div style={{...styles.userDetail, borderBottom: 'none'}}>
                        <span style={styles.userDetailLabel}>Mis à jour:</span>
                        <span style={styles.userDetailValue}>{new Date(u.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div style={styles.userCardActions}>
                      <button onClick={() => openEditModal(u)} style={{...styles.btnAction, ...styles.btnEdit}}>
                        <i className='bx bx-edit'></i>
                        Modifier
                      </button>
                      {u.locked && (
                        <button onClick={() => handleUnlockUser(u.username)} style={{...styles.btnAction, ...styles.btnUnlock}}>
                          <i className='bx bx-lock-open'></i>
                          Débloquer
                        </button>
                      )}
                      <button onClick={() => handleDeleteUser(u.id, u.username)} style={{...styles.btnAction, ...styles.btnDelete}}>
                        <i className='bx bx-trash'></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!loading && users.length === 0 && (
                <div style={styles.emptyState}>
                  <i className='bx bx-user-x' style={{fontSize: '3rem'}}></i>
                  <p>Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>
                  <i className='bx bx-user-plus'></i>
                  Créer un nouvel utilisateur
                </h2>
                <form onSubmit={handleCreateUser}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nom d'utilisateur *</label>
                      <input
                        style={styles.formInput}
                        type="text"
                        value={createForm.username}
                        onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                        required
                        minLength={3}
                        placeholder="john_doe"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email *</label>
                      <input
                        style={styles.formInput}
                        type="email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Prénom</label>
                      <input
                        style={styles.formInput}
                        type="text"
                        value={createForm.firstName}
                        onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nom</label>
                      <input
                        style={styles.formInput}
                        type="text"
                        value={createForm.lastName}
                        onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>

                    <div style={{...styles.formGroup, ...styles.formGroupFull}}>
                      <label style={styles.formLabel}>Mot de passe *</label>
                      <input
                        style={styles.formInput}
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        required
                        minLength={6}
                        placeholder="Minimum 6 caractères"
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button type="button" onClick={() => setActiveTab('list')} style={styles.btnSecondary}>
                      <i className='bx bx-x'></i>
                      Annuler
                    </button>
                    <button type="submit" style={styles.btnPrimary} disabled={loading}>
                      <i className='bx bx-check'></i>
                      {loading ? 'Création...' : 'Créer l\'utilisateur'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'edit' && selectedUser && (
            <div>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>
                  <i className='bx bx-edit-alt'></i>
                  Modifier l'utilisateur: {selectedUser.username}
                </h2>
                <form onSubmit={handleEditUser}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Email</label>
                      <input
                        style={styles.formInput}
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder={selectedUser.email}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Prénom</label>
                      <input
                        style={styles.formInput}
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder={selectedUser.firstName || 'Prénom'}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nom</label>
                      <input
                        style={styles.formInput}
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder={selectedUser.lastName || 'Nom'}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nouveau mot de passe (optionnel)</label>
                      <input
                        style={styles.formInput}
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        minLength={6}
                        placeholder="Laisser vide pour ne pas changer"
                      />
                    </div>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('list');
                        setSelectedUser(null);
                      }}
                      style={styles.btnSecondary}
                    >
                      <i className='bx bx-x'></i>
                      Annuler
                    </button>
                    <button type="submit" style={styles.btnPrimary} disabled={loading}>
                      <i className='bx bx-save'></i>
                      {loading ? 'Modification...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService, authService, type User, type RegisterData, type UpdateUserData } from '../services/api';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
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

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(createForm);
      setSuccess('Utilisateur créé avec succès!');
      setCreateForm({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      await fetchUsers();
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateUser(selectedUser.id, editForm);
      setSuccess('Utilisateur modifié avec succès!');
      await fetchUsers();
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
        setSelectedUser(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockUser = async (username: string) => {
    if (!window.confirm(`Débloquer l'utilisateur ${username}?`)) return;

    try {
      setLoading(true);
      await authService.unlockUser(username);
      setSuccess(`Utilisateur ${username} débloqué avec succès!`);
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du déblocage');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (!window.confirm(`Supprimer l'utilisateur ${username}?`)) return;

    try {
      setLoading(true);
      await userService.deleteUser(id);
      setSuccess('Utilisateur supprimé avec succès!');
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
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

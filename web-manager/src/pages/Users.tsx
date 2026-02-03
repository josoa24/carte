import React, { useState, useEffect } from 'react';
import { userService, authService, type User } from '../services/api';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import './Users.css';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_USER',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'ROLE_USER',
      });
      await fetchUsers();
      alert('Utilisateur créé avec succès !');
    } catch (error: any) {
      alert(`Erreur: ${error.message || 'Création échouée'}`);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      await fetchUsers();
      alert('Utilisateur supprimé');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleStatus = async (userId: number, enabled: boolean) => {
    try {
      await userService.updateUser(userId, { enabled: !enabled });
      await fetchUsers();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="users-container">
        <Sidebar userCount={0} />
        <div className="users-main">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <Sidebar userCount={users.length} />
      <div className="users-main">
        <div className="page-header">
          <h1>Gestion des Utilisateurs</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <i className="bx bx-plus"></i> Nouvel Utilisateur
          </button>
        </div>

      <div className="users-stats">
        <div className="stat-card">
          <i className="bx bx-user"></i>
          <div>
            <h3>{users.length}</h3>
            <p>Total Utilisateurs</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="bx bx-check-circle"></i>
          <div>
            <h3>{users.filter(u => u.enabled).length}</h3>
            <p>Actifs</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="bx bx-lock"></i>
          <div>
            <h3>{users.filter(u => u.locked).length}</h3>
            <p>Bloqués</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                    {user.enabled ? 'Actif' : 'Inactif'}
                  </span>
                  {user.locked && <span className="status-badge locked">Bloqué</span>}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-icon"
                      onClick={() => toggleStatus(user.id, user.enabled)}
                      title={user.enabled ? 'Désactiver' : 'Activer'}
                    >
                      <i className={`bx ${user.enabled ? 'bx-lock' : 'bx-lock-open'}`}></i>
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(user.id)}
                      title="Supprimer"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-icon">
                  <i className="bx bx-user-plus"></i>
                </div>
                <div>
                  <h2>Nouvel Utilisateur</h2>
                  <p className="modal-subtitle">Créer un nouveau compte utilisateur</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-body">
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="bx bx-id-card"></i>
                    Informations de connexion
                  </h3>
                  <div className="form-group">
                    <label>
                      <i className="bx bx-user"></i>
                      Nom d'utilisateur <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Entrez le nom d'utilisateur"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="bx bx-envelope"></i>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="bx bx-lock-alt"></i>
                      Mot de passe <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <span className="input-hint">Minimum 6 caractères recommandés</span>
                  </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-section">
                  <h3 className="section-title">
                    <i className="bx bx-user-circle"></i>
                    Informations personnelles
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <i className="bx bx-text"></i>
                        Prénom
                      </label>
                      <input
                        type="text"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="bx bx-text"></i>
                        Nom
                      </label>
                      <input
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="bx bx-shield-quarter"></i>
                      Rôle
                    </label>
                    <div className="select-wrapper">
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="ROLE_USER">Utilisateur</option>
                        <option value="ROLE_MANAGER">Manager</option>
                        <option value="ROLE_ADMIN">Administrateur</option>
                      </select>
                      <i className="bx bx-chevron-down select-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  <i className="bx bx-x"></i>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  <i className="bx bx-check"></i>
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Users;

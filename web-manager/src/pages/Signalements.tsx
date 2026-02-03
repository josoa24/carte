import React, { useState, useEffect } from 'react';
import { signalementService, type Signalement } from '../services/api';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import './Signalements.css';

const Signalements: React.FC = () => {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Fonction pour charger les signalements depuis l'API locale
  const fetchSignalements = async () => {
    try {
      setLoading(true);
      const data = await signalementService.getAll();
      setSignalements(data);
    } catch (error) {
      console.error('Erreur chargement signalements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les signalements au démarrage
  useEffect(() => {
    fetchSignalements();
  }, []);

  const deleteSignalement = async (signalementId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
      return;
    }

    try {
      await signalementService.delete(signalementId);
      // Rafraîchir la liste
      await fetchSignalements();
      alert('Signalement supprimé');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredSignalements = signalements.filter(s => {
    if (selectedStatus !== 'ALL' && s.statut !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: signalements.length,
    enAttente: signalements.filter(s => s.statut === 'EN_ATTENTE').length,
    enCours: signalements.filter(s => s.statut === 'EN_COURS').length,
    resolu: signalements.filter(s => s.statut === 'RESOLU').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'danger';
      case 'EN_COURS':
        return 'warning';
      case 'RESOLU':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_COURS':
        return 'En cours';
      case 'RESOLU':
        return 'Résolu';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="signalements-container">
        <Sidebar onSyncComplete={fetchSignalements} />
        <div className="signalements-main">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="signalements-container">
      <Sidebar onSyncComplete={fetchSignalements} />
      <div className="signalements-main">
        <div className="page-header">
          <h1>Gestion des Signalements</h1>
        </div>

      <div className="signalements-stats">
        <div className="stat-card">
          <i className="bx bx-error-circle"></i>
          <div>
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="stat-card danger">
          <i className="bx bx-time"></i>
          <div>
            <h3>{stats.enAttente}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div className="stat-card warning">
          <i className="bx bx-loader-circle"></i>
          <div>
            <h3>{stats.enCours}</h3>
            <p>En cours</p>
          </div>
        </div>
        <div className="stat-card success">
          <i className="bx bx-check-circle"></i>
          <div>
            <h3>{stats.resolu}</h3>
            <p>Résolus</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Statut:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="ALL">Tous</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="EN_COURS">En cours</option>
            <option value="RESOLU">Résolu</option>
          </select>
        </div>
      </div>

      <div className="signalements-grid">
        {filteredSignalements.map((signalement) => (
          <div key={signalement.idSignalement} className="signalement-card">
            <div className="card-header">
              <div>
                <h3>{signalement.titre}</h3>
                <p className="category">Par: {signalement.username}</p>
              </div>
              <span className={`status-badge ${getStatusColor(signalement.statut)}`}>
                {getStatusLabel(signalement.statut)}
              </span>
            </div>

            <div className="card-body">
              <p className="description">{signalement.description}</p>
              <div className="info-grid">
                <div className="info-item">
                  <i className="bx bx-map"></i>
                  <span>{signalement.latitude.toFixed(4)}, {signalement.longitude.toFixed(4)}</span>
                </div>
                <div className="info-item">
                  <i className="bx bx-calendar"></i>
                  <span>{new Date(signalement.dateSignalement).toLocaleDateString('fr-FR')}</span>
                </div>
                {signalement.surfaceM2 && (
                  <div className="info-item">
                    <i className="bx bx-area"></i>
                    <span>{signalement.surfaceM2} m²</span>
                  </div>
                )}
                {signalement.budget && (
                  <div className="info-item">
                    <i className="bx bx-dollar"></i>
                    <span>{signalement.budget} Ar</span>
                  </div>
                )}
                {signalement.nomEntreprise && (
                  <div className="info-item">
                    <i className="bx bx-building"></i>
                    <span>{signalement.nomEntreprise}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              <span className={`status-badge ${getStatusColor(signalement.statut)}`}>
                {getStatusLabel(signalement.statut)}
              </span>
              <button
                className="btn-icon danger"
                onClick={() => deleteSignalement(signalement.idSignalement)}
                title="Supprimer"
              >
                <i className="bx bx-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

        {filteredSignalements.length === 0 && (
          <div className="empty-state">
            <i className="bx bx-error-circle"></i>
            <p>Aucun signalement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signalements;

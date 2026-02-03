import React, { useState, useEffect } from 'react';
import { syncFromFirebase, checkFirebaseStats } from '../services/firebaseSync';
import './FirebaseSyncButton.css';

interface FirebaseSyncButtonProps {
  onSyncComplete?: () => void;
}

const FirebaseSyncButton: React.FC<FirebaseSyncButtonProps> = ({ onSyncComplete }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<{
    usersCount: number;
    signalementsCount: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSyncStats();
  }, []);

  const loadSyncStats = async () => {
    try {
      const stats = await checkFirebaseStats();
      setSyncStats(stats);
    } catch (error) {
      // Ignorer l'erreur et afficher 0
      setSyncStats({ usersCount: 0, signalementsCount: 0 });
    }
  };

  const handleSync = async () => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter au web-manager pour importer les données.');
      return;
    }

    if (!confirm('Voulez-vous importer les données de Firebase vers la base locale ?')) {
      return;
    }

    setSyncing(true);
    try {
      const result = await syncFromFirebase();
      
      alert(
        `Import terminé !\n\n` +
        `Signalements importés: ${result.signalements.success} réussis, ${result.signalements.errors} erreurs`
      );

      // Recharger les stats
      await loadSyncStats();
      
      // Fermer le modal
      setShowModal(false);
      
      // Notifier le parent pour rafraîchir les données
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      alert('Erreur lors de l\'import. Consultez la console pour plus de détails.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <button 
        className="firebase-sync-btn"
        onClick={() => setShowModal(true)}
        title="Importer depuis Firebase"
      >
        <i className="bx bx-cloud-download"></i>
        <span>Sync</span>
        {syncStats && syncStats.signalementsCount > 0 && (
          <span className="sync-badge">
            {syncStats.signalementsCount}
          </span>
        )}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal sync-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="bx bx-cloud-download"></i>
                Importer depuis Firebase
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="sync-info">
                <p>Cette action va importer les signalements de Firebase (mobile) vers votre base de données locale PostgreSQL.</p>
                
                <div className="sync-stats-grid">
                  <div className="sync-stat">
                    <i className="bx bx-error-circle"></i>
                    <div>
                      <h3>{syncStats?.signalementsCount || 0}</h3>
                      <p>Signalements dans Firebase</p>
                    </div>
                  </div>
                </div>

                <div className="warning-box">
                  <i className="bx bx-info-circle"></i>
                  <div>
                    <strong>Note:</strong> Les signalements seront ajoutés à votre base locale. 
                    Les données existantes ne seront pas modifiées.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowModal(false)}
                disabled={syncing}
              >
                Annuler
              </button>
              <button 
                className="btn-primary sync-btn" 
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin"></i>
                    Import en cours...
                  </>
                ) : (
                  <>
                    <i className="bx bx-cloud-download"></i>
                    Importer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FirebaseSyncButton;

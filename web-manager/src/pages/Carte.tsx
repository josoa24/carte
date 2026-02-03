import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { signalementService, type Signalement } from '../services/api';
import 'leaflet/dist/leaflet.css';
import 'boxicons/css/boxicons.min.css';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Couleurs professionnelles
const colors = {
  primary: '#2c3e50',
  secondary: '#34495e',
  accent: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  light: '#ecf0f1',
  white: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  border: '#bdc3c7',
};

const styles = {
  carteContainer: {
    minHeight: '100vh',
    background: colors.light,
    display: 'flex',
  },
  carteMain: {
    marginLeft: '260px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    background: colors.light,
  },
  carteHeader: {
    background: colors.white,
    padding: '1.25rem 2.5rem',
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  btnBack: {
    background: colors.secondary,
    color: colors.white,
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statsBar: {
    background: colors.white,
    margin: '0 2.5rem',
    marginTop: '1.5rem',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    border: `1px solid ${colors.border}`,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: colors.white,
  },
  statIconPrimary: {
    background: colors.primary,
  },
  statIconWarning: {
    background: colors.warning,
  },
  statIconSuccess: {
    background: colors.success,
  },
  statIconAccent: {
    background: colors.accent,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: colors.textLight,
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: colors.text,
  },
  mapWrapper: {
    flex: 1,
    margin: '1.5rem 2.5rem 2.5rem 2.5rem',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.border}`,
    position: 'relative' as const,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
  },
  popup: {
    minWidth: '280px',
  },
  popupHeader: {
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: '0.75rem',
    marginBottom: '0.75rem',
  },
  popupTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  popupLocation: {
    fontSize: '0.75rem',
    color: colors.textLight,
    marginTop: '0.25rem',
  },
  popupInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  popupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8125rem',
  },
  popupLabel: {
    color: colors.textLight,
    fontWeight: 600,
  },
  popupValue: {
    color: colors.text,
    fontWeight: 500,
  },
  statusBadge: {
    padding: '0.25rem 0.625rem',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  statusNouveau: {
    background: '#fee',
    color: colors.danger,
  },
  statusEnCours: {
    background: '#fef3cd',
    color: '#856404',
  },
  statusTermine: {
    background: '#d5f4e6',
    color: colors.success,
  },
};

const Carte = () => {
  const navigate = useNavigate();
  const [activeTab] = useState<'list' | 'create' | 'edit'>('list');
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Calcul des statistiques
  const nbPoints = signalements.length;
  const totalSurface = signalements.reduce((acc, s) => acc + (s.surfaceM2 || 0), 0);
  const totalBudget = signalements.reduce((acc, s) => acc + (s.budget || 0), 0);
  const nbTermine = signalements.filter(s => s.statut === 'RESOLU').length;
  const avancement = nbPoints > 0 ? Math.round((nbTermine / nbPoints) * 100) : 0;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'RESOLU': return 'Résolu';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return styles.statusNouveau;
      case 'EN_COURS': return styles.statusEnCours;
      case 'RESOLU': return styles.statusTermine;
      default: return {};
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.carteContainer}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={() => {}}
        userCount={0}
        onSyncComplete={fetchSignalements}
      />

      <div style={styles.carteMain}>
        <div style={styles.carteHeader}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>
              <i className='bx bx-map'></i>
              Carte des Signalements Routiers
            </h1>
            <button onClick={() => navigate('/dashboard')} style={styles.btnBack}>
              <i className='bx bx-arrow-back'></i>
              Retour
            </button>
          </div>
        </div>

        {/* Barre de statistiques */}
        <div style={styles.statsBar}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconPrimary}}>
                <i className='bx bx-map-pin'></i>
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Points signalés</div>
                <div style={styles.statValue}>{nbPoints}</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconWarning}}>
                <i className='bx bx-area'></i>
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Surface totale</div>
                <div style={styles.statValue}>{totalSurface.toFixed(1)} m²</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconSuccess}}>
                <i className='bx bx-trending-up'></i>
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Avancement</div>
                <div style={styles.statValue}>{avancement}%</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, ...styles.statIconAccent}}>
                <i className='bx bx-dollar'></i>
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Budget total</div>
                <div style={styles.statValue}>{(totalBudget / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte */}
        <div style={styles.mapWrapper}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
              <p>Chargement de la carte...</p>
            </div>
          ) : (
            <MapContainer
              center={[-18.8792, 47.5079]}
              zoom={13}
              style={styles.mapContainer}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {signalements.map((signalement) => (
                <Marker
                  key={signalement.idSignalement}
                  position={[signalement.latitude, signalement.longitude]}
                >
                  <Popup style={styles.popup}>
                    <div style={styles.popupHeader}>
                      <h3 style={styles.popupTitle}>
                        <i className='bx bx-error-circle'></i>
                        {signalement.titre}
                      </h3>
                      <div style={styles.popupLocation}>
                        <i className='bx bx-map'></i> {signalement.latitude.toFixed(4)}, {signalement.longitude.toFixed(4)}
                      </div>
                    </div>
                    
                    <div style={styles.popupInfo}>
                      <div style={styles.popupRow}>
                        <span style={styles.popupLabel}>Date:</span>
                        <span style={styles.popupValue}>{formatDate(signalement.dateSignalement)}</span>
                      </div>
                      
                      <div style={styles.popupRow}>
                        <span style={styles.popupLabel}>Status:</span>
                        <span style={{...styles.statusBadge, ...getStatusStyle(signalement.statut)}}>
                          {getStatusLabel(signalement.statut)}
                        </span>
                      </div>
                      
                      {signalement.surfaceM2 && (
                        <div style={styles.popupRow}>
                          <span style={styles.popupLabel}>Surface:</span>
                          <span style={styles.popupValue}>{signalement.surfaceM2} m²</span>
                        </div>
                      )}
                      
                      {signalement.budget && (
                        <div style={styles.popupRow}>
                          <span style={styles.popupLabel}>Budget:</span>
                          <span style={styles.popupValue}>{formatCurrency(signalement.budget)}</span>
                        </div>
                      )}
                      
                      {signalement.nomEntreprise && (
                        <div style={styles.popupRow}>
                          <span style={styles.popupLabel}>Entreprise:</span>
                          <span style={styles.popupValue}>{signalement.nomEntreprise}</span>
                        </div>
                      )}

                      <div style={styles.popupRow}>
                        <span style={styles.popupLabel}>Signalé par:</span>
                        <span style={styles.popupValue}>{signalement.username}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carte;

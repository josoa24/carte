import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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

interface Signalement {
  id: number;
  titre: string;
  latitude: number;
  longitude: number;
  date: string;
  status: 'nouveau' | 'en_cours' | 'termine';
  surface: number;
  budget: number;
  entreprise: string;
  description: string;
}

// Données statiques des signalements
const SIGNALEMENTS: Signalement[] = [
  {
    id: 1,
    titre: 'Nid de poule RN7',
    latitude: -18.8792,
    longitude: 47.5079,
    date: '2024-01-15',
    status: 'nouveau',
    surface: 12.5,
    budget: 2500000,
    entreprise: 'COLAS Madagascar',
    description: 'Nid de poule profond sur la RN7, km 15',
  },
  {
    id: 2,
    titre: 'Fissure Route Digue',
    latitude: -18.9204,
    longitude: 47.5247,
    date: '2024-01-10',
    status: 'en_cours',
    surface: 25.3,
    budget: 5800000,
    entreprise: 'SOGEA SATOM',
    description: 'Fissures importantes sur la route de la digue',
  },
  {
    id: 3,
    titre: 'Affaissement RN1',
    latitude: -18.8531,
    longitude: 47.5079,
    date: '2024-01-05',
    status: 'termine',
    surface: 18.7,
    budget: 3200000,
    entreprise: 'RAZEL-BEC',
    description: 'Affaissement de la chaussée réparé',
  },
  {
    id: 4,
    titre: 'Dégradation Analamahitsy',
    latitude: -18.8983,
    longitude: 47.5361,
    date: '2024-01-18',
    status: 'nouveau',
    surface: 8.2,
    budget: 1500000,
    entreprise: 'COLAS Madagascar',
    description: 'Dégradation importante nécessitant intervention',
  },
  {
    id: 5,
    titre: 'Réfection Bypass',
    latitude: -18.9245,
    longitude: 47.5403,
    date: '2024-01-12',
    status: 'en_cours',
    surface: 45.6,
    budget: 12000000,
    entreprise: 'SOGEA SATOM',
    description: 'Réfection complète de la zone',
  },
  {
    id: 6,
    titre: 'Réparation Ambohijatovo',
    latitude: -18.9137,
    longitude: 47.5215,
    date: '2023-12-28',
    status: 'termine',
    surface: 15.4,
    budget: 2800000,
    entreprise: 'RAZEL-BEC',
    description: 'Réparation terminée avec succès',
  },
];

const Carte = () => {
  const navigate = useNavigate();
  const [activeTab] = useState<'list' | 'create' | 'edit'>('list');

  // Calcul des statistiques
  const nbPoints = SIGNALEMENTS.length;
  const totalSurface = SIGNALEMENTS.reduce((acc, s) => acc + s.surface, 0);
  const totalBudget = SIGNALEMENTS.reduce((acc, s) => acc + s.budget, 0);
  const nbTermine = SIGNALEMENTS.filter(s => s.status === 'termine').length;
  const avancement = Math.round((nbTermine / nbPoints) * 100);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'nouveau': return styles.statusNouveau;
      case 'en_cours': return styles.statusEnCours;
      case 'termine': return styles.statusTermine;
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
          <MapContainer
            center={[-18.8792, 47.5079]}
            zoom={13}
            style={styles.mapContainer}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {SIGNALEMENTS.map((signalement) => (
              <Marker
                key={signalement.id}
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
                      <span style={styles.popupValue}>{formatDate(signalement.date)}</span>
                    </div>
                    
                    <div style={styles.popupRow}>
                      <span style={styles.popupLabel}>Status:</span>
                      <span style={{...styles.statusBadge, ...getStatusStyle(signalement.status)}}>
                        {getStatusLabel(signalement.status)}
                      </span>
                    </div>
                    
                    <div style={styles.popupRow}>
                      <span style={styles.popupLabel}>Surface:</span>
                      <span style={styles.popupValue}>{signalement.surface} m²</span>
                    </div>
                    
                    <div style={styles.popupRow}>
                      <span style={styles.popupLabel}>Budget:</span>
                      <span style={styles.popupValue}>{formatCurrency(signalement.budget)}</span>
                    </div>
                    
                    <div style={styles.popupRow}>
                      <span style={styles.popupLabel}>Entreprise:</span>
                      <span style={styles.popupValue}>{signalement.entreprise}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Carte;

import {
  collection,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { API_URL } from './api';

// Interface pour les utilisateurs Firebase
export interface FirebaseUser {
  id?: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  enabled: boolean;
  locked: boolean;
  failedLoginAttempts: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Interface pour les signalements Firebase
export interface FirebaseSignalement {
  id?: string;
  titre: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  dateSignalement?: Timestamp;
  statut: string;
  surfaceM2?: number;
  budget?: number;
  userId: string;
  username?: string;
  entrepriseId?: string;
  syncState: string;
  derniereMaj?: Timestamp;
  photoURL?: string;
}

/**
 * Convertit un Timestamp Firebase en string ISO
 */
const timestampToString = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return new Date().toISOString();
};

/**
 * Récupère tous les signalements depuis Firebase
 */
export const getSignalementsFromFirebase = async (): Promise<FirebaseSignalement[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'signalements'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseSignalement[];
  } catch (error: any) {
    // Gérer l'erreur de permission gracieusement
    if (error?.code === 'permission-denied') {
      console.warn('Permissions Firebase insuffisantes - vérifiez les règles Firestore');
      return [];
    }
    console.error('Erreur récupération signalements Firebase:', error);
    throw error;
  }
};

/**
 * Importe les signalements de Firebase vers PostgreSQL
 */
export const importSignalementsFromFirebase = async (): Promise<{ success: number; errors: number }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Veuillez vous connecter pour importer les données');
  }

  try {
    const firebaseSignalements = await getSignalementsFromFirebase();
    
    if (firebaseSignalements.length === 0) {
      return { success: 0, errors: 0 };
    }
    
    let success = 0;
    let errors = 0;

    for (const fs of firebaseSignalements) {
      try {
        // Préparer les données pour l'API PostgreSQL
        const signalementData = {
          titre: fs.titre || 'Sans titre',
          description: fs.description || '',
          latitude: fs.latitude || 0,
          longitude: fs.longitude || 0,
          statut: fs.statut || 'EN_ATTENTE',
          surfaceM2: fs.surfaceM2 || 0,
          budget: fs.budget || 0,
          idUtilisateur: parseInt(fs.userId) || 1,
          idEntreprise: fs.entrepriseId ? parseInt(fs.entrepriseId) : undefined,
        };

        // Créer le signalement dans PostgreSQL via l'API
        const response = await fetch(`${API_URL}/signalements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signalementData),
        });

        if (response.ok) {
          success++;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Erreur import signalement ${fs.id}:`, errorData);
          errors++;
        }
      } catch (error) {
        console.error(`Erreur import signalement ${fs.id}:`, error);
        errors++;
      }
    }

    return { success, errors };
  } catch (error) {
    console.error('Erreur import signalements:', error);
    throw error;
  }
};

/**
 * Synchronise les signalements de Firebase vers PostgreSQL (Import)
 */
export const syncFromFirebase = async (): Promise<{
  signalements: { success: number; errors: number };
  total: number;
}> => {
  const signalementsResult = await importSignalementsFromFirebase();

  return {
    signalements: signalementsResult,
    total: signalementsResult.success + signalementsResult.errors,
  };
};

/**
 * Vérifie le nombre de données dans Firebase
 */
export const checkFirebaseStats = async (): Promise<{
  usersCount: number;
  signalementsCount: number;
}> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const signalementsSnapshot = await getDocs(collection(db, 'signalements'));

    return {
      usersCount: usersSnapshot.size,
      signalementsCount: signalementsSnapshot.size,
    };
  } catch (error: any) {
    // Gérer l'erreur de permission gracieusement
    if (error?.code === 'permission-denied') {
      console.warn('Permissions Firebase insuffisantes pour lire les stats');
      return { usersCount: 0, signalementsCount: 0 };
    }
    console.error('Erreur vérification Firebase:', error);
    return { usersCount: 0, signalementsCount: 0 };
  }
};

// Alias pour compatibilité
export const checkFirebaseSync = checkFirebaseStats;
export const syncAllToFirebase = syncFromFirebase;
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  Timestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Interfaces Firebase
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
  entrepriseId?: string;
  syncState: string;
  derniereMaj?: Timestamp;
  photoURL?: string;
}

/**
 * Convertit un Timestamp Firebase en Date ISO string
 */
const timestampToDate = (timestamp: any): string | undefined => {
  if (!timestamp) return undefined;
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return undefined;
};

/**
 * Convertit un signalement Firebase en format API
 */
const convertFirebaseSignalement = (doc: DocumentData, id: string): any => {
  const data = doc;
  return {
    idSignalement: parseInt(id) || 0,
    titre: data.titre || '',
    description: data.description || '',
    category: data.category || 'NIDS_DE_POULE',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    dateSignalement: timestampToDate(data.dateSignalement),
    statut: data.statut || 'EN_ATTENTE',
    surfaceM2: data.surfaceM2,
    budget: data.budget,
    userId: data.userId,
    idUtilisateur: parseInt(data.userId) || 0,
    username: data.username || 'Utilisateur',
    entrepriseId: data.entrepriseId,
    idEntreprise: data.entrepriseId ? parseInt(data.entrepriseId) : undefined,
    nomEntreprise: data.nomEntreprise,
    syncState: data.syncState || 'SYNCED',
    derniereMaj: timestampToDate(data.derniereMaj),
    photoURL: data.photoURL,
  };
};

/**
 * Écoute en temps réel les changements sur les signalements
 */
export const subscribeToSignalements = (
  callback: (signalements: any[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const signalementsRef = collection(db, 'signalements');
    
    const unsubscribe = onSnapshot(
      signalementsRef,
      (snapshot) => {
        const signalements = snapshot.docs.map(doc => 
          convertFirebaseSignalement(doc.data(), doc.id)
        );
        // Tri côté client par date décroissante
        signalements.sort((a, b) => {
          const dateA = a.dateSignalement ? new Date(a.dateSignalement).getTime() : 0;
          const dateB = b.dateSignalement ? new Date(b.dateSignalement).getTime() : 0;
          return dateB - dateA;
        });
        callback(signalements);
      },
      (error) => {
        console.error('Erreur Firebase onSnapshot:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Erreur souscription Firebase:', error);
    if (onError) onError(error as Error);
    return () => {};
  }
};

/**
 * Écoute en temps réel les signalements par statut
 */
export const subscribeToSignalementsByStatus = (
  status: string,
  callback: (signalements: any[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const signalementsRef = collection(db, 'signalements');
    const q = query(signalementsRef, where('statut', '==', status));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const signalements = snapshot.docs.map(doc => 
          convertFirebaseSignalement(doc.data(), doc.id)
        );
        callback(signalements);
      },
      (error) => {
        console.error('Erreur Firebase onSnapshot:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Erreur souscription Firebase:', error);
    if (onError) onError(error as Error);
    return () => {};
  }
};

/**
 * Récupère les signalements une seule fois (sans listener)
 */
export const getSignalements = async (): Promise<any[]> => {
  try {
    const signalementsRef = collection(db, 'signalements');
    const snapshot = await getDocs(signalementsRef);
    
    const signalements = snapshot.docs.map(doc => 
      convertFirebaseSignalement(doc.data(), doc.id)
    );

    // Tri côté client
    signalements.sort((a, b) => {
      const dateA = a.dateSignalement ? new Date(a.dateSignalement).getTime() : 0;
      const dateB = b.dateSignalement ? new Date(b.dateSignalement).getTime() : 0;
      return dateB - dateA;
    });

    return signalements;
  } catch (error) {
    console.error('Erreur récupération signalements:', error);
    throw error;
  }
};

/**
 * Écoute en temps réel les utilisateurs
 */
export const subscribeToUsers = (
  callback: (users: any[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const usersRef = collection(db, 'users');
    
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(users);
      },
      (error) => {
        console.error('Erreur Firebase onSnapshot users:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Erreur souscription Firebase users:', error);
    if (onError) onError(error as Error);
    return () => {};
  }
};

/**
 * Récupère les utilisateurs une seule fois
 */
export const getUsers = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur récupération users:', error);
    throw error;
  }
};

const API_URL = 'http://localhost:3333/api';

export { API_URL };

// ===================== AUTH INTERFACES =====================
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

// ===================== USER INTERFACES =====================
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  enabled: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

// ===================== SIGNALEMENT INTERFACES =====================
export interface Signalement {
  idSignalement: number;
  titre: string;
  description: string;
  latitude: number;
  longitude: number;
  statut: string;
  surfaceM2?: number;
  budget?: number;
  idUtilisateur: number;
  username: string;
  idEntreprise?: number;
  nomEntreprise?: string;
  syncState?: string;
  dateSignalement: string;
  derniereMaj?: string;
}

export interface SignalementRequest {
  titre: string;
  description?: string;
  latitude: number;
  longitude: number;
  statut: string;
  surfaceM2?: number;
  budget?: number;
  idUtilisateur: number;
  idEntreprise?: number;
}

// ===================== ENTREPRISE INTERFACES =====================
export interface Entreprise {
  idEntreprise: number;
  nom: string;
  contact?: string;
  email?: string;
}

export interface EntrepriseRequest {
  nom: string;
  contact?: string;
  email?: string;
}

// ===================== VILLE INTERFACES =====================
export interface Ville {
  idVille: number;
  nom: string;
  latitude: number;
  longitude: number;
  rayonKm?: number;
  dateImport?: string;
}

export interface VilleRequest {
  nom: string;
  latitude: number;
  longitude: number;
  rayonKm?: number;
}

// ===================== RUE INTERFACES =====================
export interface Rue {
  idRue: number;
  nom: string;
  typeRue?: string;
  latitudeDebut: number;
  longitudeDebut: number;
  latitudeFin: number;
  longitudeFin: number;
  idVille: number;
  nomVille: string;
}

export interface RueRequest {
  nom?: string;
  typeRue?: string;
  latitudeDebut: number;
  longitudeDebut: number;
  latitudeFin: number;
  longitudeFin: number;
  idVille: number;
}

// ===================== PIECE JOINTE INTERFACES =====================
export interface PieceJointe {
  idPiece: number;
  typeFichier: string;
  chemin: string;
  dateAjout: string;
}

export interface PieceJointeRequest {
  idSignalement: number;
  typeFichier: string;
  chemin: string;
}

// ===================== MESSAGE RESPONSE =====================
export interface MessageResponse {
  message: string;
}

// ===================== HELPERS =====================
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// ===================== AUTH SERVICE =====================

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  unlockUser: async (username: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/unlock/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Unlock failed');
    }

    return response.json();
  },
};

// ===================== USER SERVICE =====================
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }

    return response.json();
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/username/${username}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};

// ===================== SIGNALEMENT SERVICE =====================
export const signalementService = {
  getAll: async (): Promise<Signalement[]> => {
    const response = await fetch(`${API_URL}/signalements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch signalements');
    }

    return response.json();
  },

  getById: async (id: number): Promise<Signalement> => {
    const response = await fetch(`${API_URL}/signalements/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch signalement');
    }

    return response.json();
  },

  create: async (data: SignalementRequest): Promise<Signalement> => {
    const response = await fetch(`${API_URL}/signalements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Create failed');
    }

    return response.json();
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/signalements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};

// ===================== ENTREPRISE SERVICE =====================
export const entrepriseService = {
  getAll: async (): Promise<Entreprise[]> => {
    const response = await fetch(`${API_URL}/entreprises`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch entreprises');
    }

    return response.json();
  },

  getById: async (id: number): Promise<Entreprise> => {
    const response = await fetch(`${API_URL}/entreprises/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch entreprise');
    }

    return response.json();
  },

  create: async (data: EntrepriseRequest): Promise<Entreprise> => {
    const response = await fetch(`${API_URL}/entreprises`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Create failed');
    }

    return response.json();
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/entreprises/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};

// ===================== VILLE SERVICE =====================
export const villeService = {
  getAll: async (): Promise<Ville[]> => {
    const response = await fetch(`${API_URL}/villes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch villes');
    }

    return response.json();
  },

  getById: async (id: number): Promise<Ville> => {
    const response = await fetch(`${API_URL}/villes/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ville');
    }

    return response.json();
  },

  create: async (data: VilleRequest): Promise<Ville> => {
    const response = await fetch(`${API_URL}/villes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Create failed');
    }

    return response.json();
  },

  update: async (id: number, data: VilleRequest): Promise<Ville> => {
    const response = await fetch(`${API_URL}/villes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }

    return response.json();
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/villes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};

// ===================== RUE SERVICE =====================
export const rueService = {
  getAll: async (): Promise<Rue[]> => {
    const response = await fetch(`${API_URL}/rues`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rues');
    }

    return response.json();
  },

  getById: async (id: number): Promise<Rue> => {
    const response = await fetch(`${API_URL}/rues/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rue');
    }

    return response.json();
  },

  getByVille: async (idVille: number): Promise<Rue[]> => {
    const response = await fetch(`${API_URL}/rues/ville/${idVille}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rues');
    }

    return response.json();
  },

  create: async (data: RueRequest): Promise<Rue> => {
    const response = await fetch(`${API_URL}/rues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Create failed');
    }

    return response.json();
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/rues/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};

// ===================== PIECE JOINTE SERVICE =====================
export const pieceJointeService = {
  getBySignalement: async (idSignalement: number): Promise<PieceJointe[]> => {
    const response = await fetch(`${API_URL}/pieces/signalement/${idSignalement}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pieces jointes');
    }

    return response.json();
  },

  getById: async (id: number): Promise<PieceJointe> => {
    const response = await fetch(`${API_URL}/pieces/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch piece jointe');
    }

    return response.json();
  },

  create: async (data: PieceJointeRequest): Promise<PieceJointe> => {
    const response = await fetch(`${API_URL}/pieces`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Create failed');
    }

    return response.json();
  },

  delete: async (id: number): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/pieces/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    return response.json();
  },
};

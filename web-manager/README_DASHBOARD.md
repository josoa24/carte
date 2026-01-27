# Dashboard Web Manager - Interface d'Administration

## 🎯 Fonctionnalités

### ✅ Gestion Complète des Utilisateurs
- **Liste des utilisateurs** - Affichage en grille avec toutes les informations
- **Création d'utilisateur** - Formulaire complet avec validation
- **Modification d'utilisateur** - Mise à jour des informations (email, prénom, nom, mot de passe)
- **Déblocage de compte** - Réinitialisation du blocage pour les comptes verrouillés
- **Suppression d'utilisateur** - Suppression avec confirmation

### 🎨 Interface Professionnelle
- Design moderne et responsive
- Animations fluides
- Cartes utilisateur avec badges de statut
- Notifications de succès/erreur
- Navigation par onglets

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Backend Spring Boot lancé sur http://localhost:8081

### Installation et lancement

```bash
cd web-manager
npm install
npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📋 Utilisation

### 1. Connexion
- Utilisez vos identifiants pour vous connecter
- Exemple : `username: josoa` / `password: josoa123`

### 2. Liste des Utilisateurs
- Visualisez tous les utilisateurs inscrits
- Badges de statut :
  - 🟢 **USER** - Utilisateur standard
  - 🟡 **ADMIN** - Administrateur
  - 🔒 **Bloqué** - Compte verrouillé après 3 tentatives échouées
- Bouton actualiser pour recharger la liste

### 3. Créer un Utilisateur
- Cliquez sur l'onglet "➕ Créer un utilisateur"
- Remplissez le formulaire :
  - Nom d'utilisateur (3-50 caractères, obligatoire)
  - Email (format valide, obligatoire)
  - Prénom (optionnel)
  - Nom (optionnel)
  - Mot de passe (minimum 6 caractères, obligatoire)
- Cliquez sur "Créer l'utilisateur"

### 4. Modifier un Utilisateur
- Cliquez sur "✏️ Modifier" sur la carte de l'utilisateur
- Modifiez les champs souhaités :
  - Email
  - Prénom
  - Nom
  - Mot de passe (laisser vide pour ne pas changer)
- Cliquez sur "Enregistrer les modifications"

### 5. Débloquer un Compte
- Si un utilisateur a le badge "🔒 Bloqué"
- Cliquez sur "🔓 Débloquer"
- Confirmez l'action
- Le compte sera immédiatement débloqué

### 6. Supprimer un Utilisateur
- Cliquez sur "🗑️ Supprimer"
- Confirmez la suppression
- L'utilisateur sera définitivement supprimé

## 🎨 Aperçu des Fonctionnalités

### Header
- Affichage du nom d'utilisateur connecté
- Badge de rôle (USER/ADMIN)
- Bouton de déconnexion

### Cartes Utilisateur
Chaque carte affiche :
- Avatar avec initiale
- Nom d'utilisateur et email
- Badges de rôle et statut
- Prénom et nom complet
- Dates de création et modification
- Actions rapides (Modifier, Débloquer, Supprimer)

### Notifications
- **Succès** (vert) : Actions réussies
- **Erreur** (rouge) : Problèmes rencontrés
- Disparition automatique après 3 secondes

## 🔒 Sécurité

- Authentification JWT requise
- Token stocké dans localStorage
- Confirmation avant suppression
- Validation côté client et serveur

## 📱 Responsive

- Adapté pour desktop, tablet et mobile
- Grille adaptative
- Formulaires optimisés pour petits écrans

## 🛠️ Technologies

- **React 19** - Framework frontend
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Vite** - Build tool
- **CSS3** - Styles personnalisés

## 📡 API Endpoints Utilisés

```typescript
// Liste des utilisateurs
GET /api/users

// Créer un utilisateur
POST /api/auth/register

// Modifier un utilisateur
PUT /api/users/{id}

// Supprimer un utilisateur
DELETE /api/users/{id}

// Débloquer un utilisateur
POST /api/auth/unlock/{username}
```

## 🎯 Améliorations Futures

- [ ] Recherche et filtres
- [ ] Pagination
- [ ] Export CSV/Excel
- [ ] Statistiques et graphiques
- [ ] Gestion des rôles avancée
- [ ] Historique des actions
- [ ] Mode sombre

## 🐛 Dépannage

### Le dashboard ne charge pas les utilisateurs
- Vérifiez que le backend est démarré sur http://localhost:8081
- Vérifiez votre token d'authentification
- Ouvrez la console du navigateur pour voir les erreurs

### Erreur 401 (Unauthorized)
- Reconnectez-vous pour obtenir un nouveau token

### Erreur CORS
- Vérifiez la configuration CORS dans le backend Spring Boot

## 👨‍💻 Développement

```bash
# Mode développement avec hot reload
npm run dev

# Build pour production
npm run build

# Preview de production
npm run preview

# Lint
npm run lint
```

---

**Bon développement ! 🚀**

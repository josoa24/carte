# Carte API - Documentation

## Description
Application Spring Boot avec gestion complète des utilisateurs incluant :
- ✅ Authentification JWT
- ✅ Inscription des utilisateurs
- ✅ Modification des informations utilisateurs
- ✅ Durée de vie des sessions (30 minutes par défaut)
- ✅ Limite de tentatives de connexion (3 par défaut, configurable)
- ✅ API de déblocage des comptes
- ✅ Documentation API via Swagger

## Prérequis
- Java 21
- Maven
- PostgreSQL (local ou Docker)

## Configuration PostgreSQL avec Docker

```bash
# Démarrer PostgreSQL dans Docker
docker run --name postgres-carte -e POSTGRES_PASSWORD=Volamihaja1jos -e POSTGRES_DB=carte -p 5432:5432 -d postgres:15

# Créer la table
docker exec -i postgres-carte psql -U postgres -d carte < table.sql
```

## Configuration

Fichier `application.properties` :

```properties
# Port de l'application (modifiable)
server.port=8080

# Durée de vie des sessions (30 minutes)
server.servlet.session.timeout=30m

# Nombre maximum de tentatives de connexion
login.max-attempts=3

# Durée de blocage en minutes
login.lock-duration=15

# JWT expiration (30 minutes en millisecondes)
jwt.expiration=1800000
```

## Démarrage

```bash
# Installer les dépendances
mvn clean install

# Démarrer l'application
mvn spring-boot:run
```

L'application démarre sur `http://localhost:8080`

## Documentation API (Swagger)

Une fois l'application démarrée, accédez à :
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **API Docs** : http://localhost:8080/api-docs

## Endpoints API

### Authentification

#### 1. Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER"
}
```

#### 2. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Réponse** : Identique à l'inscription

#### 3. Débloquer un utilisateur
```http
POST /api/auth/unlock/{username}
```

**Exemple** :
```bash
curl -X POST http://localhost:8080/api/auth/unlock/john_doe
```

### Gestion des utilisateurs (Authentification requise)

Ajoutez le token JWT dans le header :
```
Authorization: Bearer {votre_token}
```

#### 1. Récupérer tous les utilisateurs
```http
GET /api/users
Authorization: Bearer {token}
```

#### 2. Récupérer un utilisateur par ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### 3. Récupérer un utilisateur par username
```http
GET /api/users/username/{username}
Authorization: Bearer {token}
```

#### 4. Modifier un utilisateur
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "password": "newpassword123"
}
```

#### 5. Supprimer un utilisateur
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

## Fonctionnalités de sécurité

### Limite de tentatives de connexion
- Par défaut : **3 tentatives**
- Configurable via `login.max-attempts` dans `application.properties`
- Après 3 échecs, le compte est verrouillé pendant 15 minutes

### Déblocage automatique
- Le compte se débloque automatiquement après la durée configurée (15 minutes par défaut)
- Configurable via `login.lock-duration` dans `application.properties`

### Déblocage manuel
- Un administrateur peut débloquer un compte via l'API :
  ```bash
  POST /api/auth/unlock/{username}
  ```

### Durée de vie des sessions
- Par défaut : **30 minutes**
- Configurable via `server.servlet.session.timeout` dans `application.properties`
- Le JWT expire également après 30 minutes (configurable via `jwt.expiration`)

## Tests avec cURL

```bash
# 1. Inscription
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# 2. Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 3. Récupérer les utilisateurs (avec token)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Modifier un utilisateur
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated","lastName":"Name"}'

# 5. Débloquer un utilisateur
curl -X POST http://localhost:8080/api/auth/unlock/testuser
```

## Structure du projet

```
src/main/java/com/example/carte/
├── config/
│   ├── OpenApiConfig.java          # Configuration Swagger
│   └── SecurityConfig.java         # Configuration Spring Security
├── controller/
│   ├── AuthController.java         # Endpoints d'authentification
│   └── UserController.java         # Endpoints de gestion utilisateurs
├── dto/
│   ├── AuthResponse.java           # Réponse d'authentification
│   ├── LoginRequest.java           # Requête de connexion
│   ├── MessageResponse.java        # Réponse générique
│   ├── RegisterRequest.java        # Requête d'inscription
│   ├── UpdateUserRequest.java      # Requête de modification
│   └── UserResponse.java           # Réponse utilisateur
├── entity/
│   └── User.java                   # Entité utilisateur JPA
├── repository/
│   └── UserRepository.java         # Repository JPA
├── security/
│   └── JwtTokenProvider.java       # Gestion des tokens JWT
├── service/
│   └── UserService.java            # Logique métier
└── CarteApplication.java           # Classe principale
```

## Troubleshooting

### Port 8080 déjà utilisé
```bash
# Windows : Trouver le processus
netstat -ano | findstr :8080

# Tuer le processus
taskkill /PID [PID] /F

# Ou changer le port dans application.properties
server.port=8081
```

### Base de données non accessible
Vérifiez que PostgreSQL est démarré :
```bash
docker ps
```

Si non démarré :
```bash
docker start postgres-carte
```

### Erreur de connexion JWT
Le secret JWT doit faire au minimum 256 bits. Modifiez `jwt.secret` dans `application.properties` avec une valeur plus longue.

## Support

Pour toute question, consultez la documentation Swagger à l'adresse :
http://localhost:8080/swagger-ui.html

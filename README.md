# Carte - API de gestion des utilisateurs

Application Spring Boot avec authentification JWT, gestion des sessions et protection contre les attaques par force brute.

## Fonctionnalités

✅ **Authentification** - Connexion sécurisée avec JWT  
✅ **Inscription** - Création de nouveaux comptes utilisateurs  
✅ **Modification des informations** - Mise à jour du profil utilisateur  
✅ **Durée de vie des sessions** - Sessions configurables (30 minutes par défaut)  
✅ **Limite de tentatives de connexion** - Blocage automatique après 3 tentatives (configurable)  
✅ **API de déblocage** - Endpoint pour réinitialiser le blocage d'un utilisateur  
✅ **Documentation Swagger** - Documentation interactive de l'API  

## Technologies

- Java 21
- Spring Boot 4.0.1
- Spring Security
- PostgreSQL
- JWT (JSON Web Tokens)
- Swagger/OpenAPI 3
- Lombok

## Configuration

### Base de données PostgreSQL

1. Démarrer PostgreSQL avec Docker :
```bash
docker run --name postgres-carte -e POSTGRES_PASSWORD=Volamihaja1jos -e POSTGRES_DB=carte -p 5432:5432 -d postgres:15
```

2. Créer la table users :
```sql
-- Le fichier table.sql contient la structure de la base de données
```

### Configuration de l'application

Fichier `application.properties` :
```properties
# Port de l'application
server.port=8081

# Base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/carte
spring.datasource.username=postgres
spring.datasource.password=Volamihaja1jos

# Session (30 minutes)
server.servlet.session.timeout=30m

# JWT
jwt.secret=your-secret-key-change-this-in-production-minimum-256-bits
jwt.expiration=1800000

# Limite de tentatives de connexion
login.max-attempts=3
login.lock-duration=15
```

## Lancement de l'application

```bash
# Compiler et lancer avec Maven
mvn clean install
mvn spring-boot:run
```

L'application sera accessible sur : `http://localhost:8081`

## Documentation API (Swagger)

Une fois l'application lancée, accédez à la documentation Swagger :

**Swagger UI** : http://localhost:8081/swagger-ui.html  
**API Docs** : http://localhost:8081/api-docs

## Endpoints API

### Authentification

#### Inscription
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

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
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

#### Débloquer un utilisateur
```http
POST /api/auth/unlock/{username}
```

### Gestion des utilisateurs

**Note** : Ces endpoints nécessitent une authentification (token JWT)

#### Récupérer tous les utilisateurs
```http
GET /api/users
Authorization: Bearer {token}
```

#### Récupérer un utilisateur par ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Mettre à jour un utilisateur
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

#### Supprimer un utilisateur
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

## Sécurité

### Protection contre les attaques par force brute

- **Nombre maximum de tentatives** : 3 (configurable)
- **Durée de blocage** : 15 minutes (configurable)
- **Déblocage automatique** : Après la durée de blocage
- **Déblocage manuel** : Via l'endpoint `/api/auth/unlock/{username}`

### JWT (JSON Web Tokens)

- **Durée de validité** : 30 minutes (1800000 ms)
- **Algorithme** : HS256
- **Secret** : Configurable dans `application.properties`

### Sessions

- **Durée de vie** : 30 minutes
- **Cookie HTTP-Only** : Activé
- **Sessions simultanées** : Limitées à 1 par utilisateur

## Structure du projet

```
src/main/java/com/example/carte/
├── config/
│   ├── OpenApiConfig.java       # Configuration Swagger
│   └── SecurityConfig.java      # Configuration Spring Security
├── controller/
│   ├── AuthController.java      # Endpoints d'authentification
│   └── UserController.java      # Endpoints de gestion des utilisateurs
├── dto/
│   ├── AuthResponse.java        # Réponse d'authentification
│   ├── LoginRequest.java        # Requête de connexion
│   ├── MessageResponse.java     # Réponse générique
│   ├── RegisterRequest.java     # Requête d'inscription
│   ├── UpdateUserRequest.java   # Requête de mise à jour
│   └── UserResponse.java        # Réponse utilisateur
├── entity/
│   └── User.java               # Entité utilisateur
├── repository/
│   └── UserRepository.java     # Repository JPA
├── security/
│   └── JwtTokenProvider.java   # Gestion des tokens JWT
├── service/
│   └── UserService.java        # Logique métier
└── CarteApplication.java       # Classe principale
```

## Tests avec cURL

### Inscription
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Récupérer les utilisateurs (avec token)
```bash
curl -X GET http://localhost:8081/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Licence

Ce projet est sous licence MIT.

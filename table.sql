CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER',
    is_enabled BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    lock_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ville (
    id_ville BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    rayon_km DECIMAL(6, 2),
    date_import TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rue (
    id_rue BIGSERIAL PRIMARY KEY,
    nom VARCHAR(150),
    type_rue VARCHAR(50),
    latitude_debut DECIMAL(10, 7) NOT NULL,
    longitude_debut DECIMAL(10, 7) NOT NULL,
    latitude_fin DECIMAL(10, 7) NOT NULL,
    longitude_fin DECIMAL(10, 7) NOT NULL,
    id_ville BIGINT NOT NULL,
    CONSTRAINT fk_rue_ville FOREIGN KEY (id_ville) REFERENCES ville (id_ville)
);

CREATE TABLE entreprise (
    id_entreprise BIGSERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    contact VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE signalement (
    id_signalement BIGSERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    date_signalement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) NOT NULL,
    surface_m2 DECIMAL(10, 2),
    budget DECIMAL(15, 2),
    id_utilisateur BIGINT NOT NULL,
    id_entreprise BIGINT,
    sync_state VARCHAR(20) DEFAULT 'local',
    derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_signalement_entreprise FOREIGN KEY (id_entreprise) REFERENCES entreprise (id_entreprise)
);

CREATE TABLE historique_statut (
    id_historique BIGSERIAL PRIMARY KEY,
    id_signalement BIGINT NOT NULL,
    ancien_statut VARCHAR(20),
    nouveau_statut VARCHAR(20) NOT NULL,
    date_changement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_manager BIGINT NOT NULL,
    CONSTRAINT fk_hist_signalement FOREIGN KEY (id_signalement) REFERENCES signalement (id_signalement)
);

CREATE TABLE piece_jointe (
    id_piece BIGSERIAL PRIMARY KEY,
    id_signalement BIGINT NOT NULL,
    type_fichier VARCHAR(20),
    chemin TEXT NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_piece_signalement FOREIGN KEY (id_signalement) REFERENCES signalement (id_signalement)
);

CREATE INDEX idx_signalement_position ON signalement (latitude, longitude);

CREATE INDEX idx_rue_position_debut ON rue (
    latitude_debut,
    longitude_debut
);

CREATE INDEX idx_rue_position_fin ON rue (latitude_fin, longitude_fin);
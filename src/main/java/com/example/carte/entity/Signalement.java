package com.example.carte.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_signalement")
    private Long idSignalement;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "date_signalement", updatable = false)
    private LocalDateTime dateSignalement;

    @Column(nullable = false, length = 20)
    private String statut;

    @Column(name = "surface_m2", precision = 10, scale = 2)
    private BigDecimal surfaceM2;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private User utilisateur;

    @ManyToOne
    @JoinColumn(name = "id_entreprise")
    private Entreprise entreprise;

    @Column(name = "sync_state", length = 20)
    private String syncState = "local";

    @Column(name = "derniere_maj")
    private LocalDateTime derniereMaj;

    @PrePersist
    void onCreate() {
        dateSignalement = LocalDateTime.now();
        derniereMaj = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        derniereMaj = LocalDateTime.now();
    }
}

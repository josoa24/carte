package com.example.carte.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "historique_statut")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoriqueStatut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historique")
    private Long idHistorique;

    @ManyToOne
    @JoinColumn(name = "id_signalement", nullable = false)
    private Signalement signalement;

    @Column(name = "ancien_statut", length = 20)
    private String ancienStatut;

    @Column(name = "nouveau_statut", nullable = false, length = 20)
    private String nouveauStatut;

    @Column(name = "date_changement", updatable = false)
    private LocalDateTime dateChangement;

    @ManyToOne
    @JoinColumn(name = "id_manager", nullable = false)
    private User manager;

    @PrePersist
    void onCreate() {
        dateChangement = LocalDateTime.now();
    }
}

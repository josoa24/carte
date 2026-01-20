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
@Table(name = "piece_jointe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceJointe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_piece")
    private Long idPiece;

    @ManyToOne
    @JoinColumn(name = "id_signalement", nullable = false)
    private Signalement signalement;

    @Column(name = "type_fichier", length = 20)
    private String typeFichier;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String chemin;

    @Column(name = "date_ajout", updatable = false)
    private LocalDateTime dateAjout;

    @PrePersist
    void onCreate() {
        dateAjout = LocalDateTime.now();
    }
}

package com.example.carte.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rue")
    private Long idRue;

    @Column(length = 150)
    private String nom;

    @Column(name = "type_rue", length = 50)
    private String typeRue;

    @Column(name = "latitude_debut", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitudeDebut;

    @Column(name = "longitude_debut", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitudeDebut;

    @Column(name = "latitude_fin", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitudeFin;

    @Column(name = "longitude_fin", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitudeFin;

    @ManyToOne
    @JoinColumn(name = "id_ville", nullable = false)
    private Ville ville;
}

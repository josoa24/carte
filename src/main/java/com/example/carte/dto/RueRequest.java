package com.example.carte.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RueRequest {

    private String nom;
    private String typeRue;

    @NotNull
    private BigDecimal  latitudeDebut;

    @NotNull
    private BigDecimal  longitudeDebut;

    @NotNull
    private BigDecimal  latitudeFin;

    @NotNull
    private BigDecimal  longitudeFin;

    @NotNull
    private Long idVille;
}

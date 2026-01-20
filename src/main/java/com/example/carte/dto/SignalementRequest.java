package com.example.carte.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignalementRequest {

    @NotBlank
    private String titre;

    private String description;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;

    @NotBlank
    private String statut;

    private BigDecimal surfaceM2;
    private BigDecimal budget;

    @NotNull
    private Long idUtilisateur;

    private Long idEntreprise;
}

package com.example.carte.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PieceJointeRequest {

    @NotNull
    private Long idSignalement;

    @NotBlank
    private String typeFichier;

    @NotBlank
    private String chemin;
}

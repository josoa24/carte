package com.example.carte.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VilleRequest {

    @NotBlank
    private String nom;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;

    private BigDecimal rayonKm;
}

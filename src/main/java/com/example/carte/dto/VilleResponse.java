package com.example.carte.dto;

import com.example.carte.entity.Ville;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VilleResponse {

    private Long idVille;
    private String nom;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal rayonKm;
    private LocalDateTime dateImport;

    public static VilleResponse fromVille(Ville v) {
        VilleResponse r = new VilleResponse();
        r.setIdVille(v.getIdVille());
        r.setNom(v.getNom());
        r.setLatitude(v.getLatitude());
        r.setLongitude(v.getLongitude());
        r.setRayonKm(v.getRayonKm());
        r.setDateImport(v.getDateImport());
        return r;
    }
}

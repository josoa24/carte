package com.example.carte.dto;

import java.math.BigDecimal;

import com.example.carte.entity.Rue;
import lombok.Data;

@Data
public class RueResponse {

    private Long idRue;
    private String nom;
    private String typeRue;

    private BigDecimal latitudeDebut;
    private BigDecimal longitudeDebut;
    private BigDecimal latitudeFin;
    private BigDecimal longitudeFin;

    private Long idVille;
    private String nomVille;

    public static RueResponse fromRue(Rue r) {
        RueResponse res = new RueResponse();
        res.setIdRue(r.getIdRue());
        res.setNom(r.getNom());
        res.setTypeRue(r.getTypeRue());
        res.setLatitudeDebut(r.getLatitudeDebut());
        res.setLongitudeDebut(r.getLongitudeDebut());
        res.setLatitudeFin(r.getLatitudeFin());
        res.setLongitudeFin(r.getLongitudeFin());
        res.setIdVille(r.getVille().getIdVille());
        res.setNomVille(r.getVille().getNom());
        return res;
    }
}

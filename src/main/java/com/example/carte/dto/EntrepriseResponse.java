package com.example.carte.dto;

import com.example.carte.entity.Entreprise;
import lombok.Data;

@Data
public class EntrepriseResponse {

    private Long idEntreprise;
    private String nom;
    private String contact;
    private String email;

    public static EntrepriseResponse fromEntreprise(Entreprise e) {
        EntrepriseResponse r = new EntrepriseResponse();
        r.setIdEntreprise(e.getIdEntreprise());
        r.setNom(e.getNom());
        r.setContact(e.getContact());
        r.setEmail(e.getEmail());
        return r;
    }
}

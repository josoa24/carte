package com.example.carte.dto;

import com.example.carte.entity.Signalement;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SignalementResponse {

    private Long idSignalement;
    private String titre;
    private String description;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String statut;
    private BigDecimal surfaceM2;
    private BigDecimal budget;

    private Long idUtilisateur;
    private String username;

    private Long idEntreprise;
    private String nomEntreprise;

    private String syncState;
    private LocalDateTime dateSignalement;
    private LocalDateTime derniereMaj;

    public static SignalementResponse fromSignalement(Signalement s) {
        SignalementResponse r = new SignalementResponse();
        r.setIdSignalement(s.getIdSignalement());
        r.setTitre(s.getTitre());
        r.setDescription(s.getDescription());
        r.setLatitude(s.getLatitude());
        r.setLongitude(s.getLongitude());
        r.setStatut(s.getStatut());
        r.setSurfaceM2(s.getSurfaceM2());
        r.setBudget(s.getBudget());
        r.setSyncState(s.getSyncState());
        r.setDateSignalement(s.getDateSignalement());
        r.setDerniereMaj(s.getDerniereMaj());

        r.setIdUtilisateur(s.getUtilisateur().getId());
        r.setUsername(s.getUtilisateur().getUsername());

        if (s.getEntreprise() != null) {
            r.setIdEntreprise(s.getEntreprise().getIdEntreprise());
            r.setNomEntreprise(s.getEntreprise().getNom());
        }
        return r;
    }
}

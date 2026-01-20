package com.example.carte.dto;

import com.example.carte.entity.PieceJointe;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PieceJointeResponse {

    private Long idPiece;
    private String typeFichier;
    private String chemin;
    private LocalDateTime dateAjout;

    public static PieceJointeResponse fromPieceJointe(PieceJointe p) {
        PieceJointeResponse r = new PieceJointeResponse();
        r.setIdPiece(p.getIdPiece());
        r.setTypeFichier(p.getTypeFichier());
        r.setChemin(p.getChemin());
        r.setDateAjout(p.getDateAjout());
        return r;
    }
}

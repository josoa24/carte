package com.example.carte.service;

import com.example.carte.dto.PieceJointeRequest;
import com.example.carte.dto.PieceJointeResponse;
import com.example.carte.entity.PieceJointe;
import com.example.carte.entity.Signalement;
import com.example.carte.repository.PieceJointeRepository;
import com.example.carte.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PieceJointeService {

    @Autowired
    private PieceJointeRepository pieceJointeRepository;

    @Autowired
    private SignalementRepository signalementRepository;

    @Transactional
    public PieceJointeResponse create(PieceJointeRequest request) {
        Signalement s = signalementRepository.findById(request.getIdSignalement())
                .orElseThrow(() -> new RuntimeException("Signalement not found"));

        PieceJointe p = new PieceJointe();
        p.setSignalement(s);
        p.setTypeFichier(request.getTypeFichier());
        p.setChemin(request.getChemin());

        return PieceJointeResponse.fromPieceJointe(pieceJointeRepository.save(p));
    }

    public List<PieceJointeResponse> getBySignalement(Long idSignalement) {
        Signalement s = signalementRepository.findById(idSignalement)
                .orElseThrow(() -> new RuntimeException("Signalement not found"));

        return pieceJointeRepository.findBySignalement(s)
                .stream()
                .map(PieceJointeResponse::fromPieceJointe)
                .collect(Collectors.toList());
    }

    public PieceJointeResponse getById(Long id) {
        PieceJointe p = pieceJointeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pièce jointe not found"));
        return PieceJointeResponse.fromPieceJointe(p);
    }

    @Transactional
    public void delete(Long id) {
        PieceJointe p = pieceJointeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pièce jointe not found"));
        pieceJointeRepository.delete(p);
    }
}

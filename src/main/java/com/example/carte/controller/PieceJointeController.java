package com.example.carte.controller;

import com.example.carte.dto.MessageResponse;
import com.example.carte.dto.PieceJointeRequest;
import com.example.carte.dto.PieceJointeResponse;
import com.example.carte.service.PieceJointeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pieces")
@Tag(name = "Piece Jointe Management", description = "API de gestion des pièces jointes")
public class PieceJointeController {

    @Autowired
    private PieceJointeService pieceJointeService;

    @GetMapping("/signalement/{idSignalement}")
    @Operation(summary = "Récupérer toutes les pièces d'un signalement")
    public ResponseEntity<List<PieceJointeResponse>> getBySignalement(@PathVariable Long idSignalement) {
        return ResponseEntity.ok(pieceJointeService.getBySignalement(idSignalement));
    }

    @PostMapping
    @Operation(summary = "Ajouter une pièce jointe")
    public ResponseEntity<?> create(@Valid @RequestBody PieceJointeRequest request) {
        try {
            return ResponseEntity.ok(pieceJointeService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une pièce jointe par son ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            PieceJointeResponse piece = pieceJointeService.getById(id);
            return ResponseEntity.ok(piece);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une pièce jointe par son ID")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            pieceJointeService.delete(id);
            return ResponseEntity.ok(new MessageResponse("Pièce jointe supprimée avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
package com.example.carte.controller;

import com.example.carte.dto.MessageResponse;
import com.example.carte.dto.SignalementRequest;
import com.example.carte.dto.SignalementResponse;
import com.example.carte.service.SignalementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signalements")
@Tag(name = "Signalement Management", description = "API de gestion des signalements")
public class SignalementController {

    @Autowired
    private SignalementService signalementService;

    @GetMapping
    @Operation(summary = "Récupérer tous les signalements")
    public ResponseEntity<List<SignalementResponse>> getAll() {
        return ResponseEntity.ok(signalementService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un signalement par ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(signalementService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Créer un signalement")
    public ResponseEntity<?> create(@Valid @RequestBody SignalementRequest request) {
        try {
            return ResponseEntity.ok(signalementService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un signalement")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            signalementService.delete(id);
            return ResponseEntity.ok(new MessageResponse("Signalement supprimé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

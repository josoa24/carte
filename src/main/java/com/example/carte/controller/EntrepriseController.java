package com.example.carte.controller;

import com.example.carte.dto.EntrepriseRequest;
import com.example.carte.dto.EntrepriseResponse;
import com.example.carte.dto.MessageResponse;
import com.example.carte.service.EntrepriseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
@Tag(name = "Entreprise Management", description = "API de gestion des entreprises")
public class EntrepriseController {

    @Autowired
    private EntrepriseService entrepriseService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les entreprises")
    public ResponseEntity<List<EntrepriseResponse>> getAll() {
        return ResponseEntity.ok(entrepriseService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une entreprise par ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(entrepriseService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Créer une entreprise")
    public ResponseEntity<?> create(@Valid @RequestBody EntrepriseRequest request) {
        try {
            return ResponseEntity.ok(entrepriseService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une entreprise")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            entrepriseService.delete(id);
            return ResponseEntity.ok(new MessageResponse("Entreprise supprimée avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

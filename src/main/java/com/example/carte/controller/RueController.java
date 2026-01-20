package com.example.carte.controller;

import com.example.carte.dto.MessageResponse;
import com.example.carte.dto.RueRequest;
import com.example.carte.dto.RueResponse;
import com.example.carte.service.RueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rues")
@Tag(name = "Rue Management", description = "API de gestion des rues")
public class RueController {

    @Autowired
    private RueService rueService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les rues")
    public ResponseEntity<List<RueResponse>> getAll() {
        // On peut ajouter un filtre par ville si besoin
        return ResponseEntity.ok(rueService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une rue par ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rueService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ville/{idVille}")
    @Operation(summary = "Récupérer les rues d'une ville")
    public ResponseEntity<List<RueResponse>> getByVille(@PathVariable Long idVille) {
        return ResponseEntity.ok(rueService.getByVille(idVille));
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle rue")
    public ResponseEntity<?> create(@Valid @RequestBody RueRequest request) {
        try {
            return ResponseEntity.ok(rueService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une rue")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            rueService.delete(id);
            return ResponseEntity.ok(new MessageResponse("Rue supprimée avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

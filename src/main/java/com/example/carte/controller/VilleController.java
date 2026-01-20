package com.example.carte.controller;

import com.example.carte.dto.MessageResponse;
import com.example.carte.dto.VilleRequest;
import com.example.carte.dto.VilleResponse;
import com.example.carte.service.VilleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/villes")
@Tag(name = "Ville Management", description = "API de gestion des villes")
public class VilleController {

    @Autowired
    private VilleService villeService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les villes")
    public ResponseEntity<List<VilleResponse>> getAll() {
        return ResponseEntity.ok(villeService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une ville par ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(villeService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle ville")
    public ResponseEntity<?> create(@Valid @RequestBody VilleRequest request) {
        try {
            return ResponseEntity.ok(villeService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une ville")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody VilleRequest request) {
        try {
            return ResponseEntity.ok(villeService.update(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une ville")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            villeService.delete(id);
            return ResponseEntity.ok(new MessageResponse("Ville supprimée avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

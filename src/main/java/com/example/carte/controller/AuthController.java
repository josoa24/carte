package com.example.carte.controller;

import com.example.carte.dto.*;
import com.example.carte.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "API d'authentification et d'inscription")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion d'un utilisateur")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.authenticateUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/unlock/{username}")
    @Operation(summary = "Débloquer un utilisateur", 
               description = "API pour réinitialiser le blocage d'un utilisateur")
    public ResponseEntity<?> unlockUser(@PathVariable String username) {
        try {
            userService.unlockUserByUsername(username);
            return ResponseEntity.ok(new MessageResponse("User unlocked successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

package com.example.carte.service;

import com.example.carte.dto.*;
import com.example.carte.entity.User;
import com.example.carte.repository.UserRepository;
import com.example.carte.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Value("${login.max-attempts:3}")
    private int maxLoginAttempts;

    @Value("${login.lock-duration:15}")
    private int lockDurationMinutes;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Créer un nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole("USER");
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Générer le token JWT
        String token = jwtTokenProvider.generateToken(savedUser.getUsername());

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), 
                              savedUser.getEmail(), savedUser.getRole());
    }

    @Transactional
    public AuthResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier si le compte est verrouillé
        if (user.isLocked()) {
            if (user.getLockTime() != null && 
                LocalDateTime.now().isAfter(user.getLockTime().plusMinutes(lockDurationMinutes))) {
                // Débloquer le compte après la durée de verrouillage
                unlockUser(user);
            } else {
                throw new RuntimeException("Account is locked. Try again later.");
            }
        }

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            handleFailedLogin(user);
            throw new RuntimeException("Invalid password");
        }

        // Réinitialiser les tentatives de connexion en cas de succès
        if (user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setLockTime(null);
            userRepository.save(user);
        }

        // Générer le token JWT
        String token = jwtTokenProvider.generateToken(user.getUsername());

        return new AuthResponse(token, user.getId(), user.getUsername(), 
                              user.getEmail(), user.getRole());
    }

    @Transactional
    protected void handleFailedLogin(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= maxLoginAttempts) {
            user.setLocked(true);
            user.setLockTime(LocalDateTime.now());
        }

        userRepository.save(user);
    }

    @Transactional
    public void unlockUser(User user) {
        user.setLocked(false);
        user.setFailedLoginAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);
    }

    @Transactional
    public void unlockUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        unlockUser(user);
    }

    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}

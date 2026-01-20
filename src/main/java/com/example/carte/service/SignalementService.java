package com.example.carte.service;

import com.example.carte.dto.SignalementRequest;
import com.example.carte.dto.SignalementResponse;
import com.example.carte.entity.Entreprise;
import com.example.carte.entity.Signalement;
import com.example.carte.entity.User;
import com.example.carte.repository.EntrepriseRepository;
import com.example.carte.repository.SignalementRepository;
import com.example.carte.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SignalementService {

    @Autowired
    private SignalementRepository signalementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Transactional
    public SignalementResponse create(SignalementRequest request) {
        User user = userRepository.findById(request.getIdUtilisateur())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Entreprise entreprise = null;
        if (request.getIdEntreprise() != null) {
            entreprise = entrepriseRepository.findById(request.getIdEntreprise())
                    .orElseThrow(() -> new RuntimeException("Entreprise not found"));
        }

        Signalement s = new Signalement();
        s.setTitre(request.getTitre());
        s.setDescription(request.getDescription());
        s.setLatitude(request.getLatitude());
        s.setLongitude(request.getLongitude());
        s.setStatut(request.getStatut());
        s.setSurfaceM2(request.getSurfaceM2());
        s.setBudget(request.getBudget());
        s.setUtilisateur(user);
        s.setEntreprise(entreprise);

        return SignalementResponse.fromSignalement(signalementRepository.save(s));
    }

    public SignalementResponse getById(Long id) {
        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement not found"));
        return SignalementResponse.fromSignalement(s);
    }

    public List<SignalementResponse> getAll() {
        return signalementRepository.findAll()
                .stream()
                .map(SignalementResponse::fromSignalement)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        signalementRepository.deleteById(id);
    }
}

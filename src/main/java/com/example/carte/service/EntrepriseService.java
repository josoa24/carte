package com.example.carte.service;

import com.example.carte.dto.EntrepriseRequest;
import com.example.carte.dto.EntrepriseResponse;
import com.example.carte.entity.Entreprise;
import com.example.carte.repository.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntrepriseService {

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Transactional
    public EntrepriseResponse create(EntrepriseRequest request) {
        Entreprise e = new Entreprise();
        e.setNom(request.getNom());
        e.setContact(request.getContact());
        e.setEmail(request.getEmail());

        return EntrepriseResponse.fromEntreprise(entrepriseRepository.save(e));
    }

    public EntrepriseResponse getById(Long id) {
        Entreprise e = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));
        return EntrepriseResponse.fromEntreprise(e);
    }

    public List<EntrepriseResponse> getAll() {
        return entrepriseRepository.findAll()
                .stream()
                .map(EntrepriseResponse::fromEntreprise)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        entrepriseRepository.deleteById(id);
    }
}

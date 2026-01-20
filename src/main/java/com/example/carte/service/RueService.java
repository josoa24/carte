package com.example.carte.service;

import com.example.carte.dto.RueRequest;
import com.example.carte.dto.RueResponse;
import com.example.carte.entity.Rue;
import com.example.carte.entity.Ville;
import com.example.carte.repository.RueRepository;
import com.example.carte.repository.VilleRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RueService {

    @Autowired
    private RueRepository rueRepository;

    @Autowired
    private VilleRepository villeRepository;

    @Transactional
    public RueResponse create(RueRequest request) {
        Ville ville = villeRepository.findById(request.getIdVille())
                .orElseThrow(() -> new RuntimeException("Ville not found"));

        Rue rue = new Rue();
        rue.setNom(request.getNom());
        rue.setTypeRue(request.getTypeRue());
        rue.setLatitudeDebut(request.getLatitudeDebut());
        rue.setLongitudeDebut(request.getLongitudeDebut());
        rue.setLatitudeFin(request.getLatitudeFin());
        rue.setLongitudeFin(request.getLongitudeFin());
        rue.setVille(ville);

        return RueResponse.fromRue(rueRepository.save(rue));
    }
    public List<RueResponse> getAll() {
        return rueRepository.findAll()
                .stream()
                .map(RueResponse::fromRue)
                .collect(Collectors.toList());
    }

    public RueResponse getById(Long id) {
        Rue rue = rueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rue not found"));
        return RueResponse.fromRue(rue);
    }

    public List<RueResponse> getByVille(Long idVille) {
        Ville ville = villeRepository.findById(idVille)
                .orElseThrow(() -> new RuntimeException("Ville not found"));

        return rueRepository.findByVille(ville)
                .stream()
                .map(RueResponse::fromRue)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        Rue rue = rueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rue not found"));
        rueRepository.delete(rue);
    }
}

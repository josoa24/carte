package com.example.carte.service;

import com.example.carte.dto.VilleRequest;
import com.example.carte.dto.VilleResponse;
import com.example.carte.entity.Ville;
import com.example.carte.repository.VilleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VilleService {

    @Autowired
    private VilleRepository villeRepository;

    @Transactional
    public VilleResponse create(VilleRequest request) {
        if (villeRepository.existsByNom(request.getNom())) {
            throw new RuntimeException("Ville already exists");
        }

        Ville ville = new Ville();
        ville.setNom(request.getNom());
        ville.setLatitude(request.getLatitude());
        ville.setLongitude(request.getLongitude());
        ville.setRayonKm(request.getRayonKm());

        return VilleResponse.fromVille(villeRepository.save(ville));
    }

    public VilleResponse getById(Long id) {
        Ville ville = villeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ville not found"));
        return VilleResponse.fromVille(ville);
    }

    public List<VilleResponse> getAll() {
        return villeRepository.findAll()
                .stream()
                .map(VilleResponse::fromVille)
                .collect(Collectors.toList());
    }

    @Transactional
    public VilleResponse update(Long id, VilleRequest request) {
        Ville ville = villeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ville not found"));

        ville.setNom(request.getNom());
        ville.setLatitude(request.getLatitude());
        ville.setLongitude(request.getLongitude());
        ville.setRayonKm(request.getRayonKm());

        return VilleResponse.fromVille(villeRepository.save(ville));
    }

    @Transactional
    public void delete(Long id) {
        Ville ville = villeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ville not found"));
        villeRepository.delete(ville);
    }
}

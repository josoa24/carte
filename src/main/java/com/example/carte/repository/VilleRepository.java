package com.example.carte.repository;

import com.example.carte.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VilleRepository extends JpaRepository<Ville, Long> {

    boolean existsByNom(String nom);
}

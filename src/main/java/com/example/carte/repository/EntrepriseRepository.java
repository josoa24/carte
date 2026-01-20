package com.example.carte.repository;

import com.example.carte.entity.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

    boolean existsByNom(String nom);
}

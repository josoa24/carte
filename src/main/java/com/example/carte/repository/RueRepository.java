package com.example.carte.repository;

import com.example.carte.entity.Rue;
import com.example.carte.entity.Ville;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RueRepository extends JpaRepository<Rue, Long> {

    List<Rue> findByVille(Ville ville);

    List<Rue> findByNomContainingIgnoreCase(String nom);
}

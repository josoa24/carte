package com.example.carte.repository;

import com.example.carte.entity.Entreprise;
import com.example.carte.entity.Signalement;
import com.example.carte.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {

    List<Signalement> findByUtilisateur(User utilisateur);

    List<Signalement> findByStatut(String statut);

    List<Signalement> findByEntreprise(Entreprise entreprise);
}

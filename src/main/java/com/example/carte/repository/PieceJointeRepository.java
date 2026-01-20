package com.example.carte.repository;

import com.example.carte.entity.PieceJointe;
import com.example.carte.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PieceJointeRepository extends JpaRepository<PieceJointe, Long> {

    List<PieceJointe> findBySignalement(Signalement signalement);
}

package com.example.carte.repository;

import com.example.carte.entity.HistoriqueStatut;
import com.example.carte.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueStatutRepository extends JpaRepository<HistoriqueStatut, Long> {

    List<HistoriqueStatut> findBySignalementOrderByDateChangementDesc(Signalement signalement);
}

package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {
}

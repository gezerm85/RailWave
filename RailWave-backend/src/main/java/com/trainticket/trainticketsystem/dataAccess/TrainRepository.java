package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
}

package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.Station;
import com.trainticket.trainticketsystem.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> getTripsByDepartureStation_IdAndArrivalStation_IdAndDepartureDate(
            Long departureStationId,
            Long arrivalStationId,
            LocalDate departureDate
    );

}

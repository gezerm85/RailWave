package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.dto.request.TripRequest;
import com.trainticket.trainticketsystem.entities.Station;
import com.trainticket.trainticketsystem.entities.Trip;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public interface TripService {

    Trip save(TripRequest tripRequest);
    List<Trip> search(Long departureStationId, Long arrivalStationId, LocalDate departureDate);
    List<Trip> findAll();
    Trip findById(Long id);
    void deleteById(Long id);

}

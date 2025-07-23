package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.business.abstracts.TripService;
import com.trainticket.trainticketsystem.dto.request.TripRequest;
import com.trainticket.trainticketsystem.entities.Trip;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping("/")
    public ResponseEntity<Trip> createTrip(@RequestBody TripRequest tripRequest) {
        Trip trip = tripService.save(tripRequest);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/")
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.findAll();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Trip>> getAllTrips(
            @RequestParam(required = true) Long departureStationId,
            @RequestParam(required = true) Long arrivalStationId,
            @RequestParam(required = true) LocalDate departureDate
            ) {
        List<Trip> trips = tripService.search(departureStationId, arrivalStationId, departureDate);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.findById(id);
        return ResponseEntity.ok(trip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTripById(@PathVariable Long id) {
        tripService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.business.abstracts.StationService;
import com.trainticket.trainticketsystem.dto.request.StationRequest;
import com.trainticket.trainticketsystem.dto.response.StationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    @PostMapping("/")
    public ResponseEntity<StationResponse> createStation(@RequestBody StationRequest stationRequest) {
        StationResponse stationResponse = stationService.save(stationRequest);
        return ResponseEntity.ok(stationResponse);
    }

    @GetMapping("/")
    public ResponseEntity<List<StationResponse>> getAllStations() {
        List<StationResponse> stationResponses = stationService.findAll();
        return ResponseEntity.ok(stationResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationResponse> getStationById(@PathVariable Long id) {
        StationResponse stationResponse = stationService.findById(id);
        return ResponseEntity.ok(stationResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStationById(@PathVariable Long id) {
        stationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

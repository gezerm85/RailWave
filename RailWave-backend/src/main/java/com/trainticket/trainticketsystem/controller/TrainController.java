package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.business.abstracts.TrainService;
import com.trainticket.trainticketsystem.dto.request.TrainRequest;
import com.trainticket.trainticketsystem.dto.response.TrainResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @PostMapping("/")
    public ResponseEntity<TrainResponse> createTrain(@RequestBody TrainRequest trainRequest) {
        TrainResponse trainResponse = trainService.save(trainRequest);
        return ResponseEntity.ok(trainResponse);
    }

    @GetMapping("/")
    public ResponseEntity<List<TrainResponse>> getAllTrains() {
        List<TrainResponse> trainResponses = trainService.findAll();
        return ResponseEntity.ok(trainResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainResponse> getTrainById(@PathVariable Long id) {
        TrainResponse trainResponse = trainService.findById(id);
        return ResponseEntity.ok(trainResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainById(@PathVariable Long id) {
        trainService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

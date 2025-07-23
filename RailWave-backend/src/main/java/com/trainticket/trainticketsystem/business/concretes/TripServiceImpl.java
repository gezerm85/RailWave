package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.TripService;
import com.trainticket.trainticketsystem.dataAccess.StationRepository;
import com.trainticket.trainticketsystem.dataAccess.TrainRepository;
import com.trainticket.trainticketsystem.dataAccess.TripRepository;
import com.trainticket.trainticketsystem.dto.converter.TripMapper;
import com.trainticket.trainticketsystem.dto.request.TripRequest;
import com.trainticket.trainticketsystem.entities.Station;
import com.trainticket.trainticketsystem.entities.Train;
import com.trainticket.trainticketsystem.entities.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class TripServiceImpl implements TripService {

    private final TripMapper tripMapper;
    private final TripRepository tripRepository;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;

    @Autowired
    public TripServiceImpl(
            TripMapper tripMapper,
            TripRepository tripRepository,
            StationRepository stationRepository,
            TrainRepository trainRepository) {
        this.tripMapper = tripMapper;
        this.tripRepository = tripRepository;
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
    }


    @Override
    public Trip save(TripRequest tripRequest) {


        Train train = trainRepository.findById(tripRequest.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));


        Station departureStation = stationRepository.findById(tripRequest.getDepartureStationId())
                .orElseThrow(() -> new RuntimeException("Departure station not found"));


        Station arrivalStation = stationRepository.findById(tripRequest.getArrivalStationId())
                .orElseThrow(() -> new RuntimeException("Arrival station not found"));

        if(Objects.equals(tripRequest.getDepartureStationId(), tripRequest.getArrivalStationId())) {
            throw new RuntimeException("Departure and arrival stations cannot be the same");
        }

        Trip newTrip = Trip.builder()
                .train(train)
                .departureStation(departureStation)
                .arrivalStation(arrivalStation)
                .departureDate(tripRequest.getDepartureDate())
                .departureTime(tripRequest.getDepartureTime())
                .arrivalDate(tripRequest.getArrivalDate())
                .arrivalTime(tripRequest.getArrivalTime())
                .price(tripRequest.getPrice())
                .build();

        return tripRepository.save(newTrip);

    }

    @Override
    public List<Trip> search(Long departureStationId, Long arrivalStationId, LocalDate departureDate) {
        return tripRepository.getTripsByDepartureStation_IdAndArrivalStation_IdAndDepartureDate(
                departureStationId,
                arrivalStationId,
                departureDate
        );
    }

    @Override
    public List<Trip> findAll() {
        return tripRepository.findAll();
    }

    @Override
    public Trip findById(Long id) {
        return tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    @Override
    public void deleteById(Long id) {

        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip not found");
        }
        tripRepository.deleteById(id);

    }
}

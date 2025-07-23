package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.StationService;
import com.trainticket.trainticketsystem.dataAccess.StationRepository;
import com.trainticket.trainticketsystem.dto.converter.StationMapper;
import com.trainticket.trainticketsystem.dto.request.StationRequest;
import com.trainticket.trainticketsystem.dto.response.StationResponse;
import com.trainticket.trainticketsystem.entities.Station;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationServiceImpl implements StationService {

    private final StationMapper stationMapper;
    private final StationRepository stationRepository;

    @Autowired
    public StationServiceImpl(StationMapper stationMapper, StationRepository stationRepository) {
        this.stationMapper = stationMapper;
        this.stationRepository = stationRepository;
    }

    @Override
    public StationResponse save(StationRequest stationRequest) {
        Station newStation = stationMapper.toEntity(stationRequest);
        Station savedStation = stationRepository.save(newStation);
        return stationMapper.toResponse(savedStation);
    }

    @Override
    public List<StationResponse> findAll() {
        List<Station> stations = stationRepository.findAll();
        return stationMapper.toResponseList(stations);
    }

    @Override
    public StationResponse findById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        return stationMapper.toResponse(station);
    }

    @Override
    public void deleteById(Long id) {

        if (!stationRepository.existsById(id)) {
            throw new RuntimeException("Station not found");
        }
        stationRepository.deleteById(id);
    }
}

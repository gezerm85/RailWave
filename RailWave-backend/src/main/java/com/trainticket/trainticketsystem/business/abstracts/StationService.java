package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.dto.request.StationRequest;
import com.trainticket.trainticketsystem.dto.response.StationResponse;

import java.util.List;

public interface StationService {
    StationResponse save(StationRequest stationRequest);
    List<StationResponse> findAll();
    StationResponse findById(Long id);
    void deleteById(Long id);
}

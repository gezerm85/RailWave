package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.dto.request.TrainRequest;
import com.trainticket.trainticketsystem.dto.response.TrainResponse;

import java.util.List;

public interface TrainService {

    TrainResponse save(TrainRequest trainRequest);
    List<TrainResponse> findAll();
    TrainResponse findById(Long id);
    void deleteById(Long id);

}

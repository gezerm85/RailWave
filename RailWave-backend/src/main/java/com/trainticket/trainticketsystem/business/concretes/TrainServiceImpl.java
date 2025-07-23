package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.TrainService;
import com.trainticket.trainticketsystem.dataAccess.TrainRepository;
import com.trainticket.trainticketsystem.dto.converter.TrainMapper;
import com.trainticket.trainticketsystem.dto.request.TrainRequest;
import com.trainticket.trainticketsystem.dto.response.TrainResponse;
import com.trainticket.trainticketsystem.entities.Train;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainServiceImpl implements TrainService {

    private final TrainMapper trainMapper;
    private final TrainRepository trainRepository;

    @Autowired
    public TrainServiceImpl(TrainMapper trainMapper, TrainRepository trainRepository) {
        this.trainMapper = trainMapper;
        this.trainRepository = trainRepository;
    }

    @Override
    public TrainResponse save(TrainRequest trainRequest) {
        System.out.println("TrainRequest: " + trainRequest);
        Train newTrain = trainMapper.toEntity(trainRequest);
        System.out.println("New Train: " + newTrain);
        Train savedTrain = trainRepository.save(newTrain);
        System.out.println("Saved Train: " + savedTrain);
        return trainMapper.toResponse(savedTrain);
    }

    @Override
    public List<TrainResponse> findAll() {
        List<Train> trains = trainRepository.findAll();
        return trainMapper.toResponseList(trains);
    }

    @Override
    public TrainResponse findById(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        return trainMapper.toResponse(train);
    }

    @Override
    public void deleteById(Long id) {

        if (!trainRepository.existsById(id)) {
            throw new RuntimeException("Train not found");
        }
        trainRepository.deleteById(id);

    }
}

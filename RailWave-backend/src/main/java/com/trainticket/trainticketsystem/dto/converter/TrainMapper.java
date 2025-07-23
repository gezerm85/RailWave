package com.trainticket.trainticketsystem.dto.converter;

import com.trainticket.trainticketsystem.dto.request.TrainRequest;
import com.trainticket.trainticketsystem.dto.response.TrainResponse;
import com.trainticket.trainticketsystem.entities.Train;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TrainMapper {

    TrainResponse toResponse(Train train);

    List<TrainResponse> toResponseList(List<Train> trains);

    Train toEntity(TrainRequest trainRequest);

}

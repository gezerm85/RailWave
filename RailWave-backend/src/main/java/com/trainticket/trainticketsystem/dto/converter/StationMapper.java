package com.trainticket.trainticketsystem.dto.converter;

import com.trainticket.trainticketsystem.dto.request.StationRequest;
import com.trainticket.trainticketsystem.dto.response.StationResponse;
import com.trainticket.trainticketsystem.entities.Station;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StationMapper {

    StationResponse toResponse(Station station);

    List<StationResponse> toResponseList(List<Station> stations);

    Station toEntity(StationResponse stationResponse);

    Station toEntity(StationRequest stationRequest);

}

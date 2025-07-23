package com.trainticket.trainticketsystem.dto.converter;

import com.trainticket.trainticketsystem.dto.request.TripRequest;
import com.trainticket.trainticketsystem.entities.Trip;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface TripMapper {

    Trip toEntity(TripRequest tripRequest);

}

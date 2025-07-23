package com.trainticket.trainticketsystem.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TripRequest {

    private Long trainId;

    private Long departureStationId;

    private Long arrivalStationId;

    private LocalDate departureDate;

    @JsonFormat(pattern = "HH:mm")
    @Schema(type = "string", example = "14:30")
    private LocalTime departureTime;

    private LocalDate arrivalDate;

    @JsonFormat(pattern = "HH:mm")
    @Schema(type = "string", example = "14:30")
    private LocalTime arrivalTime;

    private int price;

}

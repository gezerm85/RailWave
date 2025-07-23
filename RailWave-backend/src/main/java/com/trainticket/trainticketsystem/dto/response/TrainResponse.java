package com.trainticket.trainticketsystem.dto.response;

import lombok.Data;

@Data
public class TrainResponse {

    private Long id;
    private String name;
    private int seatCount;

}

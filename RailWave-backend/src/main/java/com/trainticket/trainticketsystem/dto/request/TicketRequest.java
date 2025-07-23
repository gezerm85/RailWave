package com.trainticket.trainticketsystem.dto.request;

import lombok.Data;

@Data
public class TicketRequest {

    private Long tripId;

    private int seatNumber;

}

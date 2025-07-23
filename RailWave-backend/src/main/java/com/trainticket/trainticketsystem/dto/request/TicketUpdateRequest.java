package com.trainticket.trainticketsystem.dto.request;

import com.trainticket.trainticketsystem.entities.Ticket;
import lombok.Data;

@Data
public class TicketUpdateRequest {

    private Ticket.Status status;

}

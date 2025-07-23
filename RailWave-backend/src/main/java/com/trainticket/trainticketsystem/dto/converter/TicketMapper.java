package com.trainticket.trainticketsystem.dto.converter;

import com.trainticket.trainticketsystem.dto.request.TicketRequest;
import com.trainticket.trainticketsystem.entities.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    Ticket toTicket(TicketRequest ticketRequest);
}

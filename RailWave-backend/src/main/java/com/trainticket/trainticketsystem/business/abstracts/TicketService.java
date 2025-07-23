package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.dto.request.TicketRequest;
import com.trainticket.trainticketsystem.dto.request.TicketUpdateRequest;
import com.trainticket.trainticketsystem.entities.Ticket;
import com.trainticket.trainticketsystem.entities.User;

import java.util.List;

public interface TicketService {
    Ticket save(String email, TicketRequest ticketRequest);
    List<Ticket> createMultipleTickets(String email, List<TicketRequest> ticketRequests);
    List<Ticket> findMyTickets(String email);
    List<Ticket> findAll();
    List<Ticket> findAllByTripId(Long tripId);
    Ticket findById(Long id);
    Ticket update(Long id, TicketUpdateRequest ticketUpdateRequest);
    void deleteById(Long id);
}

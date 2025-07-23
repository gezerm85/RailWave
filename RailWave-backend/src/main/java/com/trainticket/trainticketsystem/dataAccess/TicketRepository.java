package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findTicketsByUser_Id(Long userId);
    Ticket findTicketsByTrip_IdAndSeatNumber(Long tripId, int seatNumber);
    List<Ticket> findTicketsByTrip_Id(Long tripId);
}

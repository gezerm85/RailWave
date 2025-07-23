package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.business.abstracts.TicketService;
import com.trainticket.trainticketsystem.dto.request.TicketRequest;
import com.trainticket.trainticketsystem.dto.request.TicketUpdateRequest;
import com.trainticket.trainticketsystem.entities.Ticket;
import com.trainticket.trainticketsystem.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/")
    public ResponseEntity<Ticket> createTicket(@AuthenticationPrincipal UserDetails userDetails, @RequestBody TicketRequest ticketRequest) {
        String email = userDetails.getUsername();
        Ticket ticket = ticketService.save(email, ticketRequest);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<Ticket>> createMultipleTickets(@AuthenticationPrincipal UserDetails userDetails, @RequestBody List<TicketRequest> ticketRequests) {
        String email = userDetails.getUsername();
        List<Ticket> tickets = ticketService.createMultipleTickets(email, ticketRequests);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<Ticket>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        List<Ticket> tickets = ticketService.findMyTickets(email);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.findAll();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Ticket>> getTicketsByTripId(@PathVariable Long tripId) {
        List<Ticket> tickets = ticketService.findAllByTripId(tripId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        Ticket ticket = ticketService.findById(id);
        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody TicketUpdateRequest ticketUpdateRequest) {
        Ticket updatedTicket = ticketService.update(id, ticketUpdateRequest);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

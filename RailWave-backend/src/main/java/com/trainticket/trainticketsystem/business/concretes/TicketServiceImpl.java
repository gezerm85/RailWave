package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.TicketService;
import com.trainticket.trainticketsystem.dataAccess.TicketRepository;
import com.trainticket.trainticketsystem.dataAccess.TripRepository;
import com.trainticket.trainticketsystem.dataAccess.UserRepository;
import com.trainticket.trainticketsystem.dto.converter.TicketMapper;
import com.trainticket.trainticketsystem.dto.request.TicketRequest;
import com.trainticket.trainticketsystem.dto.request.TicketUpdateRequest;
import com.trainticket.trainticketsystem.entities.Ticket;
import com.trainticket.trainticketsystem.entities.Trip;
import com.trainticket.trainticketsystem.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class TicketServiceImpl implements TicketService {

    private final TicketMapper ticketMapper;
    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Autowired
    public TicketServiceImpl(
            TicketMapper ticketMapper,
            TicketRepository ticketRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.ticketMapper = ticketMapper;
        this.ticketRepository = ticketRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Ticket save(String email, TicketRequest ticketRequest) {
        Trip trip = tripRepository.findById(ticketRequest.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket existingTicket = ticketRepository.findTicketsByTrip_IdAndSeatNumber(ticketRequest.getTripId(), ticketRequest.getSeatNumber());
        if (existingTicket != null) {
            throw new RuntimeException("Ticket already exists for this trip and seat number");
        }


        Ticket newTicket = Ticket.builder()
                .trip(trip)
                .user(user)
                .seatNumber(ticketRequest.getSeatNumber())
                .build();

        return ticketRepository.save(newTicket);

    }

    @Override
    public List<Ticket> createMultipleTickets(String email, List<TicketRequest> ticketRequests) {
        if (ticketRequests.isEmpty()) {
            throw new RuntimeException("Ticket requests cannot be empty");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ticket> ticketList = new ArrayList<>();
        for (TicketRequest ticketRequest : ticketRequests) {
            Trip trip = tripRepository.findById(ticketRequest.getTripId())
                    .orElseThrow(() -> new RuntimeException("Trip not found"));

            Ticket existingTicket = ticketRepository.findTicketsByTrip_IdAndSeatNumber(ticketRequest.getTripId(), ticketRequest.getSeatNumber());
            if (existingTicket != null) {
                throw new RuntimeException("Ticket already exists for this trip and seat number");
            }

            Ticket newTicket = Ticket.builder()
                    .trip(trip)
                    .user(user)
                    .seatNumber(ticketRequest.getSeatNumber())
                    .build();

            ticketList.add(ticketRepository.save(newTicket));
        }
        return ticketList;
    }

    @Override
    public List<Ticket> findMyTickets(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findTicketsByUser_Id(user.getId());
    }

    @Override
    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    @Override
    public List<Ticket> findAllByTripId(Long tripId) {
        return ticketRepository.findTicketsByTrip_Id(tripId);
    }

    @Override
    public Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public Ticket update(Long id, TicketUpdateRequest ticketUpdateRequest) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(ticketUpdateRequest.getStatus());

        return ticketRepository.save(ticket);

    }

    @Override
    public void deleteById(Long id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticketRepository.delete(ticket);

    }
}

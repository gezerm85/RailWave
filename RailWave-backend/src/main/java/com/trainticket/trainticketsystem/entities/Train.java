package com.trainticket.trainticketsystem.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "seat_count", nullable = false)
    private int seatCount;

}

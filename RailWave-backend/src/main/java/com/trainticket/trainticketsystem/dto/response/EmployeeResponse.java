package com.trainticket.trainticketsystem.dto.response;

import com.trainticket.trainticketsystem.entities.Employee;
import lombok.Data;

@Data
public class EmployeeResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private int age;
    private Employee.Gender gender;
    private String phoneNumber;
    private String address;
}

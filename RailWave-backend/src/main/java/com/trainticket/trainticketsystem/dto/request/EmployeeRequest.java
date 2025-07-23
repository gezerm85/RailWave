package com.trainticket.trainticketsystem.dto.request;

import com.trainticket.trainticketsystem.entities.Employee.Gender;
import lombok.Data;

@Data
public class EmployeeRequest {
    private String firstName;
    private String lastName;
    private int age;
    private Gender gender;
    private String phoneNumber;
    private String address;
}

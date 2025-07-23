package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.dto.request.EmployeeRequest;
import com.trainticket.trainticketsystem.dto.response.EmployeeResponse;

import java.util.List;

public interface EmployeeService {
    EmployeeResponse save(EmployeeRequest employeeRequest);
    List<EmployeeResponse> findAll();
    EmployeeResponse findById(Long id);
    void deleteById(Long id);
}

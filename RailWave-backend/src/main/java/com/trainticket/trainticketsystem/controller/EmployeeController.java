package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.business.abstracts.EmployeeService;
import com.trainticket.trainticketsystem.dto.request.EmployeeRequest;
import com.trainticket.trainticketsystem.dto.response.EmployeeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/")
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestBody EmployeeRequest employeeRequest) {
        EmployeeResponse employeeResponse = employeeService.save(employeeRequest);
        return ResponseEntity.ok(employeeResponse);
    }

    @GetMapping("/")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employeeResponses = employeeService.findAll();
        return ResponseEntity.ok(employeeResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employeeResponse = employeeService.findById(id);
        return ResponseEntity.ok(employeeResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeById(@PathVariable Long id) {
        employeeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}

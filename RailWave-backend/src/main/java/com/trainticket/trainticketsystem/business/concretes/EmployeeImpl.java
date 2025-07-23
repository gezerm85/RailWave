package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.EmployeeService;
import com.trainticket.trainticketsystem.dataAccess.EmployeeRepository;
import com.trainticket.trainticketsystem.dto.converter.EmployeeMapper;
import com.trainticket.trainticketsystem.dto.request.EmployeeRequest;
import com.trainticket.trainticketsystem.dto.response.EmployeeResponse;
import com.trainticket.trainticketsystem.entities.Employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeImpl implements EmployeeService {

    private final EmployeeMapper employeeMapper;

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeImpl(EmployeeMapper employeeMapper, EmployeeRepository employeeRepository) {
        this.employeeMapper = employeeMapper;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeResponse save(EmployeeRequest employeeRequest) {
        Employee newEmployee = employeeMapper.toEntity(employeeRequest);
        Employee savedEmployee = employeeRepository.save(newEmployee);
        return employeeMapper.toResponse(savedEmployee);
    }

    @Override
    public List<EmployeeResponse> findAll() {
        List<Employee> employees = employeeRepository.findAll();
        return employeeMapper.toResponseList(employees);
    }

    @Override
    public EmployeeResponse findById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return employeeMapper.toResponse(employee);
    }

    @Override
    public void deleteById(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }
}

package com.trainticket.trainticketsystem.dto.converter;

import com.trainticket.trainticketsystem.dto.request.EmployeeRequest;
import com.trainticket.trainticketsystem.dto.response.EmployeeResponse;
import com.trainticket.trainticketsystem.entities.Employee;
import org.mapstruct.Mapper;

import java.util.List;


@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    EmployeeResponse toResponse(Employee employee);

    List<EmployeeResponse> toResponseList(List<Employee> employees);

    EmployeeRequest toRequest(Employee employee);

    Employee toEntity(EmployeeResponse employeeResponse);

    Employee toEntity(EmployeeRequest employeeRequest);

}

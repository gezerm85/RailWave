package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}

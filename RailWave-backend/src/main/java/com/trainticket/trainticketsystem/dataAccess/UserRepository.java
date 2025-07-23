package com.trainticket.trainticketsystem.dataAccess;

import com.trainticket.trainticketsystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findUserByResetToken(String token);
}

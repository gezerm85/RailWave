package com.trainticket.trainticketsystem.business.abstracts;

import com.trainticket.trainticketsystem.entities.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);
    Optional<User> findUserByResetToken(String token);
    User save(User user);
}

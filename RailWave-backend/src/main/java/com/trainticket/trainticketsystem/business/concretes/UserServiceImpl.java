package com.trainticket.trainticketsystem.business.concretes;

import com.trainticket.trainticketsystem.business.abstracts.UserService;
import com.trainticket.trainticketsystem.dataAccess.UserRepository;
import com.trainticket.trainticketsystem.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findUserByResetToken(String token) {
        return userRepository.findUserByResetToken(token);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}

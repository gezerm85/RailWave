package com.trainticket.trainticketsystem.security;

import com.trainticket.trainticketsystem.business.abstracts.UserService;
import com.trainticket.trainticketsystem.core.EmailService;
import com.trainticket.trainticketsystem.dto.request.LoginRequest;
import com.trainticket.trainticketsystem.dto.request.RegisterRequest;
import com.trainticket.trainticketsystem.dto.response.AuthResponse;
import com.trainticket.trainticketsystem.entities.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthenticationService(UserService userService, JwtUtil jwtUtil,
                                 AuthenticationManager authenticationManager,
                                 PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userService.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(User.Role.USER)
                .build();

        userService.save(user);
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token);
    }

    public boolean forgotPassword(String email) {
        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiration(LocalDateTime.now().plusHours(1));
            userService.save(user);

            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            emailService.sendEmail(user.getEmail(), "Reset Password Request", "Link: " + resetLink);
            return true;

        }
        return false;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userService.findUserByResetToken(token);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getResetTokenExpiration().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetToken(null);
                user.setResetTokenExpiration(null);
                userService.save(user);
                return true;
            }
        }
        return false;
    }


}

package com.trainticket.trainticketsystem.controller;

import com.trainticket.trainticketsystem.dto.request.LoginRequest;
import com.trainticket.trainticketsystem.dto.request.RegisterRequest;
import com.trainticket.trainticketsystem.dto.response.AuthResponse;
import com.trainticket.trainticketsystem.security.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationService authService;

    @Autowired
    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        if(authService.forgotPassword(email)) {
            return ResponseEntity.ok("Password reset link sent to your email.");
        } else {
            return ResponseEntity.badRequest().body("Failed to send password reset link.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        if(authService.resetPassword(token, newPassword)) {
            return ResponseEntity.ok("Password reset successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to reset password.");
        }
    }


}

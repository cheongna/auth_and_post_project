package com.dohyeon.auth_post.service;

import com.dohyeon.auth_post.dto.UserRequestDto;
import com.dohyeon.auth_post.dto.UserResponseDto;
import com.dohyeon.auth_post.entity.User;
import com.dohyeon.auth_post.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        User user = User.builder()
                .username(userRequestDto.getUsername())
                .password(passwordEncoder.encode(userRequestDto.getPassword()))
                .email(userRequestDto.getEmail())
                .build();
        user = repository.save(user);

        if (user.getId() == null) {
            throw new RuntimeException("회원가입 실패. 관리자에게 문의하세요");
        } else {
            return new UserResponseDto(user);
        }
    }

    public UserResponseDto updateUser(long userId, UserRequestDto userRequestDto) {
        User user = repository.findById(userId).orElseThrow();
        user.setUsername(userRequestDto.getUsername());
        user.setPassword(userRequestDto.getPassword());
        user.setEmail(userRequestDto.getEmail());
        user = repository.save(user);
        return new UserResponseDto(user);
    }

    public UserResponseDto deleteUser(long userId) {
        User user = repository.findById(userId).orElseThrow();
        repository.deleteById(userId);
        return new UserResponseDto(user);
    }

    public UserResponseDto findUserById(long userId) {
        User user = repository.findById(userId).orElseThrow();
        return new UserResponseDto(user);
    }

    public String login(String username, String password) {
        User user = repository.findByUsername(username);
        if (user.getPassword().equals(password)) {
            return "로그인 성공";
        } else {
            return "로그인 실패";
        }
    }
}

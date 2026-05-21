package com.dohyeon.auth_post.controller;

import com.dohyeon.auth_post.dto.UserRequestDto;
import com.dohyeon.auth_post.dto.UserResponseDto;
import com.dohyeon.auth_post.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/users")
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public UserResponseDto createUser(@RequestBody UserRequestDto userRequestDto) {
        return userService.createUser(userRequestDto);
    }

    @PutMapping("/update/{userId}")
    public UserResponseDto updateUser(@PathVariable long userId, @RequestBody UserRequestDto userRequestDto) {
        return userService.updateUser(userId, userRequestDto);
    }
}

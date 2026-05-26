package com.dohyeon.auth_post.controller;

import com.dohyeon.auth_post.dto.LoginDto;
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

    @DeleteMapping("/{userId}")
    public UserResponseDto deleteUser(@PathVariable long userId) {
        return userService.deleteUser(userId);
    }

    @GetMapping("/{userId}")
    public UserResponseDto getUser(@PathVariable long userId) {
        return userService.findUserById(userId);
    }

//    @PostMapping("/login")
//    public String login(@RequestBody LoginDto loginDto) {
//        return userService.login(loginDto.getUsername(), loginDto.getPassword());
//    }
}

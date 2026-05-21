package com.dohyeon.auth_post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UserRequestDto {
    private String username;
    private String password;
    private String email;
}

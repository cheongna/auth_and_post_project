package com.dohyeon.auth_post.dto;

import lombok.Getter;

@Getter
public class BoardRequestDto {
    private String title;
    private String content;
    private Long userId;
}

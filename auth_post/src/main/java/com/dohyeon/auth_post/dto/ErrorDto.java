package com.dohyeon.auth_post.dto;
import org.springframework.http.HttpStatus;

public record ErrorDto(HttpStatus status, String message) {
}

package com.dohyeon.auth_post.config.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import tools.jackson.databind.annotation.JsonSerialize;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 유저를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

}

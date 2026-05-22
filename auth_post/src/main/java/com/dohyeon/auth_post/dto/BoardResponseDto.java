package com.dohyeon.auth_post.dto;

import com.dohyeon.auth_post.entity.Board;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardResponseDto {
    private Long id;
    private Long userId;
    private String title;
    private String content;

    public BoardResponseDto(Board board) {
        this.id = board.getId();
        this.userId = board.getUserId();
        this.title = board.getTitle();
        this.content = board.getContent();
    }
}

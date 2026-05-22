package com.dohyeon.auth_post.controller;

import com.dohyeon.auth_post.dto.BoardRequestDto;
import com.dohyeon.auth_post.dto.BoardResponseDto;
import com.dohyeon.auth_post.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/board")
@RestController
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @PostMapping
    public BoardResponseDto addBoard(@RequestBody BoardRequestDto boardRequestDto) {
        return boardService.addBoard(boardRequestDto);
    }

    @GetMapping("/{boardId}")
    public BoardResponseDto getBoard(@PathVariable("boardId") Long boardId) {
        return boardService.getBoard(boardId);
    }
}

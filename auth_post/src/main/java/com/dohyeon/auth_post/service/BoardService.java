package com.dohyeon.auth_post.service;

import com.dohyeon.auth_post.dto.BoardRequestDto;
import com.dohyeon.auth_post.dto.BoardResponseDto;
import com.dohyeon.auth_post.entity.Board;
import com.dohyeon.auth_post.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository repository;

    public BoardResponseDto addBoard(BoardRequestDto dto) {
        Board board = Board.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .userId(dto.getUserId())
                .build();
        board = repository.save(board);
        if (board.getId() == null) throw new RuntimeException("게시글 등록 실패");
        return new BoardResponseDto(board);
    }

    public BoardResponseDto getBoard(Long boardId) {
        return new BoardResponseDto(repository.findById(boardId).orElseThrow());
    }
}

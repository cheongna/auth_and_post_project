package com.dohyeon.auth_post.repository;

import com.dohyeon.auth_post.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}

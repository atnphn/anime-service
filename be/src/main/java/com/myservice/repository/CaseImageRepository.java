package com.myservice.repository;

import com.myservice.entity.CaseImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaseImageRepository extends JpaRepository<CaseImage, Long> {
    Optional<CaseImage> findByUrl(String url);
}

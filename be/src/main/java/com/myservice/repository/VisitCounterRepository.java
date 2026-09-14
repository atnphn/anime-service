package com.myservice.repository;

import com.myservice.entity.VisitCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface VisitCounterRepository extends JpaRepository<VisitCounter, Long> {

    @Modifying
    @Query("UPDATE VisitCounter v SET v.count = v.count + 1 WHERE v.id = :id")
    void incrementCount(Long id);
}

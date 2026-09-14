package com.myservice.controller;

import com.myservice.dto.VisitCountResponse;
import com.myservice.entity.VisitCounter;
import com.myservice.repository.VisitCounterRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private static final Long COUNTER_ID = 1L;

    private final VisitCounterRepository repository;

    public VisitController(VisitCounterRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/count")
    public VisitCountResponse getCount() {
        VisitCounter counter = repository.findById(COUNTER_ID)
                .orElseGet(() -> repository.save(new VisitCounter(COUNTER_ID, 0L)));
        return new VisitCountResponse(counter.getCount());
    }

    @PostMapping("/increment")
    @Transactional
    public VisitCountResponse increment() {
        if (repository.findById(COUNTER_ID).isEmpty()) {
            repository.save(new VisitCounter(COUNTER_ID, 0L));
        }
        repository.incrementCount(COUNTER_ID);
        VisitCounter counter = repository.findById(COUNTER_ID).orElseThrow();
        return new VisitCountResponse(counter.getCount());
    }
}

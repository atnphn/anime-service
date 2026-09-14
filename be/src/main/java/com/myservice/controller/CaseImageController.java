package com.myservice.controller;

import com.myservice.dto.AddImageRequest;
import com.myservice.dto.ImageDto;
import com.myservice.entity.CaseImage;
import com.myservice.repository.CaseImageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
public class CaseImageController {

    private final CaseImageRepository repository;

    public CaseImageController(CaseImageRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ImageDto> listImages() {
        return repository.findAll().stream()
                .map(img -> new ImageDto(img.getId(), img.getUrl()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ImageDto> addImage(@RequestBody AddImageRequest request) {
        String url = request.getUrl() == null ? "" : request.getUrl().trim();
        if (url.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<CaseImage> existing = repository.findByUrl(url);
        if (existing.isPresent()) {
            CaseImage img = existing.get();
            return ResponseEntity.ok(new ImageDto(img.getId(), img.getUrl()));
        }

        CaseImage saved = repository.save(new CaseImage(url));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ImageDto(saved.getId(), saved.getUrl()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeImage(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

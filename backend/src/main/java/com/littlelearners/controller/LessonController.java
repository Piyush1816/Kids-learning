package com.littlelearners.controller;

import com.littlelearners.dsa.SearchEngine;
import com.littlelearners.model.Category;
import com.littlelearners.model.Lesson;
import com.littlelearners.service.CurriculumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LessonController {
    private final CurriculumService curriculumService;

    public LessonController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(curriculumService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Category cat = curriculumService.getCategoryById(id);
        if (cat == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(curriculumService.getLessonsByCategory(category));
        }
        return ResponseEntity.ok(curriculumService.getAllLessons());
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable String id) {
        Lesson lesson = curriculumService.getLessonById(id);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lesson);
    }

    @GetMapping("/lessons/search/binary")
    public ResponseEntity<SearchEngine.SearchResult<Lesson>> searchLessonBinary(@RequestParam String id) {
        return ResponseEntity.ok(curriculumService.searchLessonBinary(id));
    }
}

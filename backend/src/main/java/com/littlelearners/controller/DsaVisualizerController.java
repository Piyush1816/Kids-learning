package com.littlelearners.controller;

import com.littlelearners.service.DsaVisualizerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dsa")
@CrossOrigin(origins = "*")
public class DsaVisualizerController {
    private final DsaVisualizerService dsaVisualizerService;

    public DsaVisualizerController(DsaVisualizerService dsaVisualizerService) {
        this.dsaVisualizerService = dsaVisualizerService;
    }

    @GetMapping("/concepts")
    public ResponseEntity<List<Map<String, Object>>> getDsaConcepts() {
        return ResponseEntity.ok(dsaVisualizerService.getDsaConcepts());
    }

    @GetMapping("/benchmark/search")
    public ResponseEntity<DsaVisualizerService.BenchmarkComparison> runSearchBenchmark(
            @RequestParam(required = false, defaultValue = "100") int size) {
        int boundedSize = Math.max(10, Math.min(size, 10000));
        return ResponseEntity.ok(dsaVisualizerService.runSearchBenchmark(boundedSize));
    }

    @GetMapping("/benchmark/sort")
    public ResponseEntity<DsaVisualizerService.BenchmarkComparison> runSortBenchmark(
            @RequestParam(required = false, defaultValue = "100") int size) {
        int boundedSize = Math.max(10, Math.min(size, 2000)); // Cap to avoid huge O(n^2) delays
        return ResponseEntity.ok(dsaVisualizerService.runSortBenchmark(boundedSize));
    }
}

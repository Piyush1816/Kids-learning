package com.littlelearners;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LittleLearnersApplication {

    public static void main(String[] args) {
        SpringApplication.run(LittleLearnersApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" 🦊 LITTLE LEARNERS SPRING BOOT BACKEND STARTED! ");
        System.out.println(" API Base URL: http://localhost:8080/api         ");
        System.out.println(" Swagger/Endpoints:                              ");
        System.out.println("  - GET /api/categories                          ");
        System.out.println("  - GET /api/lessons                             ");
        System.out.println("  - GET /api/quizzes                             ");
        System.out.println("  - GET /api/challenges/daily                    ");
        System.out.println("  - GET /api/rewards                             ");
        System.out.println("  - GET /api/leaderboard                         ");
        System.out.println("  - GET /api/dsa/concepts                        ");
        System.out.println("  - GET /api/dsa/benchmark/search                ");
        System.out.println("=================================================");
    }
}

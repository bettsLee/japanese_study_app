package com.jp5.backend.domain.quiz;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quiz")
@Tag(name = "퀴즈", description = "퀴즈 진행 API")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    @Operation(summary = "퀴즈 문제 조회", description = "퀴즈 대상 항목 중 랜덤으로 최대 10개 반환")
    public List<QuizQuestionResponse> getQuestions(Authentication auth) {
        return quizService.getQuizQuestions(auth.getName());
    }

    @PostMapping("/answer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "퀴즈 답변 제출", description = "문제 정답 여부를 제출하고 DB 업데이트")
    public void submitAnswer(@RequestBody QuizAnswerRequest request, Authentication auth) {
        quizService.submitAnswer(request.entryId(), request.correct(), auth.getName());
    }
}

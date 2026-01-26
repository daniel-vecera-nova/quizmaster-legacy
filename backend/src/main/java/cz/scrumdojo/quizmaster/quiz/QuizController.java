package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.question.Question;
import cz.scrumdojo.quizmaster.question.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import cz.scrumdojo.quizmaster.QuizUtils;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuizController {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Autowired
    public QuizController(QuestionRepository questionRepository,
                          QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    @Transactional
    @GetMapping("/quiz/{id}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Integer id) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        int questionsLimit = (quiz.getSize() != null && quiz.getSize() > 0)
                ? quiz.getSize()
                : quiz.getQuestionIds().length;

        Question[] questions = new Question[questionsLimit];
        for (int i = 0; i < questionsLimit; i++) {
            questions[i] = questionRepository.getReferenceById(quiz.getQuestionIds()[i]);
        }

        if (quiz.getFinalCount() != null && quiz.getFinalCount() > 0  && questions.length > 0) {
            List<Question> questionList = Arrays.asList(questions);
            Collections.shuffle(questionList);
            questions = questionList.subList(0, quiz.getFinalCount())
                    .toArray(new Question[quiz.getFinalCount() - 1]);
                    questions = QuizUtils.shrinkQuestions(questions, quiz.getFinalCount());
        }

        QuizResponse build = QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .questions(questions)
                .mode(quiz.getMode())
                .difficulty(quiz.getDifficulty())
                .passScore(quiz.getPassScore())
                .timeLimit(quiz.getTimeLimit())
                .size(quiz.getSize())
                .build();

        return ResponseEntity.ok(build);
    }

    @Transactional
    @PostMapping("/quiz")
    public ResponseEntity<Integer> createQuiz(@RequestBody Quiz quizInput) {
        Quiz output = quizRepository.save(quizInput);
        return ResponseEntity.ok(output.getId());
    }

}

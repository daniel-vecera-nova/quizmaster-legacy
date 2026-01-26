package cz.scrumdojo.quizmaster.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional
    @GetMapping("/question/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Integer id) {
        return response(findQuestion(id));
    }

    @Transactional
    @GetMapping("/question/{editId}/edit")
    public ResponseEntity<Question> getQuestionByEditId(@PathVariable String editId) {
        return response(questionRepository.findByEditId(editId));
    }

    @Transactional
    @PostMapping("/question")
    public QuestionCreateResponse saveQuestion(@RequestBody Question question) {
        var createdQuestion = questionRepository.save(question);
        return new QuestionCreateResponse(createdQuestion.getId(), createdQuestion.getEditId());
    }

    @Transactional
    @PatchMapping("/question/{editId}")
    public Integer updateQuestion(@RequestBody Question question, @PathVariable String editId) {
        var existingQuestion = questionRepository.findByEditId(editId)
            .orElseThrow(() -> new IllegalArgumentException("Question not found with editId: " + editId));
        question.setId(existingQuestion.getId());
        question.setEditId(editId);
        questionRepository.save(question);
        return existingQuestion.getId();
    }

    private Optional<Question> findQuestion(Integer id) {
        return questionRepository.findById(id);
    }

    private <T> ResponseEntity<T> response(Optional<T> entity) {
        return entity
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

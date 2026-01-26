package cz.scrumdojo.quizmaster.question;

import cz.scrumdojo.quizmaster.TestFixtures;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuestionControllerTest {

    @Autowired
    private TestFixtures fixtures;

    @Autowired
    private QuestionController questionController;

    @Test
    public void saveAndGetQuestion() {
        var question = fixtures.question().build();
        var response = questionController.saveQuestion(question);
        assertNotNull(response.getId());

        Question result = questionController.getQuestion(response.getId()).getBody();
        assertNotNull(result);
        assertQuestion(question, result);
    }

    @Test
    public void updateQuestion() {
        var originalQuestion = fixtures.save(fixtures.question());

        var updatedQuestion = fixtures.multipleChoiceQuestion().build();
        questionController.updateQuestion(updatedQuestion, originalQuestion.getEditId());

        var result = questionController.getQuestion(originalQuestion.getId()).getBody();
        assertNotNull(result);
        assertQuestion(updatedQuestion, result);
    }

    private void assertQuestion(Question question, Question result) {
        assertEquals(question.getId(), result.getId());
        assertEquals(question.getEditId(), result.getEditId());
        assertEquals(question.getWorkspaceGuid(), result.getWorkspaceGuid());
        assertEquals(question.getQuestion(), result.getQuestion());
        assertArrayEquals(question.getAnswers(), result.getAnswers());
        assertArrayEquals(question.getExplanations(), result.getExplanations());
        assertArrayEquals(question.getCorrectAnswers(), result.getCorrectAnswers());
        assertEquals(question.getQuestionExplanation(), result.getQuestionExplanation());
        assertEquals(question.isEasyMode(), result.isEasyMode());
    }

    @Test
    public void getQuestionByEditId() {
        var question = fixtures.save(fixtures.question());

        Question result = questionController.getQuestionByEditId(question.getEditId()).getBody();

        assertNotNull(result);
        assertEquals(question.getId(), result.getId());
    }

    @Test
    public void saveQuestion() {
        var question = fixtures.question().build();
        var response = questionController.saveQuestion(question);

        assertNotNull(response.getId());
        assertNotNull(response.getEditId());
    }

    @Test
    public void nonExistingQuestion() {
        ResponseEntity<?> response = questionController.getQuestion(-1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}

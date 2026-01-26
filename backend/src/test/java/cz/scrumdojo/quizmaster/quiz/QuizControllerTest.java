package cz.scrumdojo.quizmaster.quiz;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class QuizControllerTest {

    @Autowired
    private QuizController quizController;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void createAndGetQuiz() {
        Question question = fixtures.save(fixtures.question());
        Quiz quiz = fixtures.quiz(question,question).build();

        Integer quizId = quizController.createQuiz(quiz).getBody();
        assertNotNull(quizId, "Quiz ID should not be null after creation");

        QuizResponse quizResponse = quizController.getQuiz(quizId).getBody();
        assertNotNull(quizResponse);

        assertEquals(quizId, quizResponse.getId());
        assertEquals(quiz.getTitle(), quizResponse.getTitle());
        assertEquals(quiz.getDescription(), quizResponse.getDescription());
        assertEquals(quiz.getMode(), quizResponse.getMode());
        assertEquals(quiz.getPassScore(), quizResponse.getPassScore());
        assertEquals(quiz.getTimeLimit(), quizResponse.getTimeLimit());
        assertEquals(quiz.getSize(), quizResponse.getSize());
        assertEquals(1, quizResponse.getQuestions().length);
        assertEquals(question.getId(), quizResponse.getQuestions()[0].getId());
    }

}

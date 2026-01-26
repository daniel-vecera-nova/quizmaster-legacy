package cz.scrumdojo.quizmaster;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import cz.scrumdojo.quizmaster.question.*;
import org.springframework.boot.test.context.SpringBootTest;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
public class QuizUtilsTest {

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void shuffleQuestions() {
        Question[] questions = new Question[] {fixtures.questionWithId(1).build(),fixtures.questionWithId(2).build(),fixtures.questionWithId(3).build(),fixtures.questionWithId(4).build()};
        int iters = 1000000;
        Question[] shuffled = questions.clone();
        double countshuffled = 0;
        for (int i = 0; i < iters; i++) {
            shuffled = QuizUtils.shuffleQuestions(shuffled);
            double shuffledAll = 0;
            for (int j = 0; j < questions.length; j++){
                if(questions[j].getId()!=shuffled[j].getId()){
                    shuffledAll++;
                }
            }
            if (shuffledAll > 0){
                countshuffled++;
            }
        }
        double x = countshuffled/iters;
        assertTrue(x > 0.9);
    }

    @Test
    public void shrinkQuestions() {
        Question[] questions = new Question[] {fixtures.question().build(),fixtures.question().build(),fixtures.question().build(),fixtures.question().build()};
        int length = 3;
        questions = QuizUtils.shrinkQuestions(questions, length);
        assertEquals(length, questions.length);
    }
}

package cz.scrumdojo.quizmaster;
import cz.scrumdojo.quizmaster.question.*;
import java.util.*;

public class QuizUtils {
    /**
     * This method is awesome. Řekl a napsal Luboš Hambálek - analytik zo Slovenska.
     */
    public static Question[] shuffleQuestions(Question[] questions){
        List<Question> questionList = Arrays.asList(questions);
        Collections.shuffle(questionList);
        return questionList.toArray(new Question[questions.length]);
    }

    public static Question[] shrinkQuestions(Question[] questions, int lenght){
        Question[] _questions = new Question[lenght];
        for (int i = 0; i < lenght; i++) {
            _questions[i] = questions[i];
        }
        return  _questions;
    }
}

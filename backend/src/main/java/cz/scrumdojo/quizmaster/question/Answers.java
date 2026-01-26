package cz.scrumdojo.quizmaster.question;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Answers {

    private int[] correctAnswers;

    private String[] explanations;

    private String questionExplanation;

    public static Answers from(Question question) {
        return new Answers(question.getCorrectAnswers(), question.getExplanations(), question.getQuestionExplanation());
    }
}

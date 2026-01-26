package cz.scrumdojo.quizmaster.question;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProgressState {
    private Long total;
    private Long current;
}

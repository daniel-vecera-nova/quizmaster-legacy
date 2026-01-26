package cz.scrumdojo.quizmaster.workspace;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuestionListItem {
    Integer id;
    String question;
    String editId;
}

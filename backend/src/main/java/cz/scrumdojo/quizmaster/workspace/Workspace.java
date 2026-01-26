package cz.scrumdojo.quizmaster.workspace;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "workspace")
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String guid;

    @Column(name = "title", columnDefinition = "text[]")
    private String title;
}

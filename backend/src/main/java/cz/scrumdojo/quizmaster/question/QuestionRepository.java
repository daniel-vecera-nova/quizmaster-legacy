package cz.scrumdojo.quizmaster.question;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByWorkspaceGuid(String guid);

    Optional<Question> findByEditId(String editId);
}

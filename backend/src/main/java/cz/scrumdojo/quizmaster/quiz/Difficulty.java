package cz.scrumdojo.quizmaster.quiz;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Difficulty {
    @JsonProperty("easy") EASY,
    @JsonProperty("hard") HARD,
    @JsonProperty("keep-question") KEEP_QUESTION
}

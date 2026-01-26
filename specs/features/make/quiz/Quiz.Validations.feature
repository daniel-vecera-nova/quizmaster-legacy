Feature: Create Quiz from Workspace

  Background:
    Given a workspace with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
      | 4 / 2 = ? | 2 (*), 3 |

  Scenario: Create quiz with default values
    When I start creating a new quiz
    Then I see empty quiz title
    * I see empty quiz description
    * I see time limit "600" seconds
    * I see pass score "80"
    * I see quiz question "2 + 2 = ?"
    * I see quiz question "3 * 3 = ?"
    * I see quiz question "4 / 2 = ?"

  Scenario: Create quiz with more questions in randomized than available
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I check randomized function
    * I enter number of randomized questions in quiz 3
    * I submit the quiz
    Then I see error messages
      | too-many-randomized-questions |

  Scenario: Quiz form with only default values
    When I start creating a new quiz
    * I submit the quiz
    Then I see error messages in quiz form
      | empty-title   |
      | few-questions |

  @skip
  Scenario: Display error when score is above 100
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter pass score "220"
    * I submit the quiz
    Then I see error messages in quiz form
      | scoreAboveMax |

  @skip
  Scenario: Display error when limit is negative
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter time limit "-10"
    * I submit the quiz
    Then I see error messages in quiz form
      | negativeTimeLimit |

  @skip
  Scenario: Display error when limit is over 21600
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter time limit "21601"
    * I submit the quiz
    Then I see error messages in quiz form
      | timeLimitAboveMax |

  @skip
  Scenario: Display no error when timelimit is cleared
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I clear time limit
    * I select question "2 + 2 = ?"
    * I submit the quiz
    Then I see no error messages in quiz form
    * I see time limit "0" seconds

  @skip
  Scenario: Display no error when score is cleared
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I clear score
    * I select question "2 + 2 = ?"
    * I submit the quiz
    Then I see no error messages in quiz form
    * I see pass score "0"

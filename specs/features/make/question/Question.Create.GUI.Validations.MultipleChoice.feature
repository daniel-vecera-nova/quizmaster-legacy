Feature: Create question GUI
  - Question text is required
  - Answer text for each answer is required
  - At least one correct answer is required
  - Question explanation is optional

  Background:
    Given I start creating a question
    And I check show explanations checkbox
    * I enter question "What are cities of Czech Republic?"
    * with answers:
      | Brno     |  | No Brno |
      | Brussels |  | Yes     |
      | Prague   |  | Yes     |
      | Berlin   |  | Germany |

  Scenario: Create multiple choice question without correct answer
    When I attempt to save the question
    Then I see error messages
      | no-correct-answer |

  Scenario: Create multiple choice question with one correct answer
    Given I mark answer 2 as correct
    When I mark the question as multiple choice
    And I attempt to save the question
    Then I see error messages
      | few-correct-answers |

  Scenario: Create multiple choice question with all correct answers
    Given I mark answer 2 as correct
    * I mark answer 3 as correct
    * I mark answer 4 as correct
    * I mark answer 1 as correct
    When I attempt to save the question
    Then I see no error messages

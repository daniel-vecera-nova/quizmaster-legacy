Feature: Create question GUI
    - Question text is required
    - Answer text for each answer is required
    - At least one correct answer is required
    - Question explanation is optional

  Scenario: Empty question form
    Given I start creating a question
    When I attempt to save the question
    Then I see error messages
      | empty-question    |
      | empty-answer      |
      | no-correct-answer |

  Scenario: Empty question text
    Given I start creating a question
    And I check show explanations checkbox
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 2 text "5"
    When I attempt to save the question
    Then I see error messages
      | empty-question |

  Scenario: All answers must be filled in
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I mark answer 1 as correct
    When I attempt to save the question
    Then I see error messages
      | empty-answer |

  Scenario: Add an empty answer
    Given I start creating a question
    And I check show explanations checkbox
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 2 text "5"
    * I add an additional answer
    When I attempt to save the question
    Then I see error messages
      | empty-answer |

  Scenario: Answer explanations missing
    Either all or no answer explanations are required

    Given I start creating a question
    And I check show explanations checkbox
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 1 explanation "4 is the answer"
    * I enter answer 2 text "5"
    When I attempt to save the question
    Then I see error messages
      | empty-answer-explanation |

  Scenario: All answer explanations
    Either all or no answer explanations are required

    Given I start creating a question
    And I check show explanations checkbox
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 1 explanation "4 is the answer"
    * I enter answer 2 text "5"
    * I enter answer 2 explanation "5 is the answer, but in another universe"
    When I attempt to save the question
    Then I see no error messages

  Scenario: Single-choice question: No correct answer
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I enter answer 2 text "5"
    When I attempt to save the question
    Then I see error messages
      | no-correct-answer |

  Scenario: Single-choice question: No correct answer message disappears after selecting a correct answer
    For single-choice question, exactly one correct answer is required

    Given I start creating a question
    * I enter question "What is 2 + 2?"
    * I enter answer 1 text "4"
    * I enter answer 2 text "5"
    * I attempt to save the question
    * I mark answer 1 as correct
    When I attempt to save the question
    Then I see no error messages

  Scenario: Empty question text error message disappears after adding question text
    Given I start creating a question
    And I check show explanations checkbox
    * I enter answer 1 text "4" and mark it as correct
    * I enter answer 2 text "5"
    * I attempt to save the question
    * I enter question "What is 2 + 2?"
    When I attempt to save the question
    Then I see no error messages

Feature: Create question GUI - Single/multiple choice
  Single choice question has exactly one answer correct
  Multiple choice question can have two or more answers correct

  Background:
    Given I start creating a question
    And I check show explanations checkbox

  Scenario: Default is single choice
    Then I see multiple choice is unchecked

  Scenario: Single choice: Mark correct answer
    * I enter answers
      | Brno       |  |
      | Berlin     |  |
      | Bratislava |  |
    When I mark answer 2 as correct
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Single choice: Change correct answer
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark answer 1 as correct
    Then I see the answers fields
      | Brno       | * |
      | Berlin     |   |
      | Bratislava |   |

  Scenario: Multiple choice: Mark multiple correct answers
    * I mark the question as multiple choice
    * I enter answers
      | Brno       |  |
      | Berlin     |  |
      | Bratislava |  |
    When I mark answer 2 as correct
    * I mark answer 3 as correct
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava | * |

  Scenario: Switch single to multiple choice: Keep selection
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as multiple choice
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Switch multiple to single choice: Keep selection
    If exactly one answer is marked as correct for a multiple choice question,
    switching to single choice keeps the marked answer

    * I mark the question as multiple choice
    * I enter answers
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as multiple choice
    Then I see the answers fields
      | Brno       |   |
      | Berlin     | * |
      | Bratislava |   |

  Scenario: Switch multiple to single choice: Reset selection
    If more than one answer is marked as correct for a multiple choice question,
    switching to single choice unmarks all answers.

    * I mark the question as multiple choice
    * I enter answers
      | Brno       | * |
      | Berlin     | * |
      | Bratislava |   |
    When I mark the question as single choice
    Then I see the answers fields
      | Brno       |  |
      | Berlin     |  |
      | Bratislava |  |

  Scenario: Easy Mode: Verify that Easy mode is visible only for Multiple Choice
    # default case (Single choice)
    Then I see multiple choice is unchecked
    And I see easy mode is not visible

    When I mark the question as multiple choice
    Then I see easy mode is visible
    And I see easy mode is unchecked

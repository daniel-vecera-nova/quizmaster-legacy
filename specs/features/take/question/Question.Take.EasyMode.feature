Feature: Take a question in EasyMode

  Scenario: Multiple choice question - Easy Mode ON - correct ansers is 3
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   | * |
      | Canada  |   |
    * marked as easy mode
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see that the question has 3 correct answers

  Scenario: Multiple choice question - Easy Mode ON - correct ansers is 2
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   |   |
      | Canada  |   |
    * marked as easy mode
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see that the question has 2 correct answers

  Scenario: Multiple choice question - Easy Mode OFF - no correct ansers
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   |   |
      | Canada  |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I do not see correct answers count

  Scenario: Single choice question - Easy Mode N/A - no correct ansers
    Given a question "Which of these countries is not in Europe?"
    * with answers:
      | Italy   |   |
      | France  |   |
      | Morocco | * |
      | Spain   |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I do not see correct answers count

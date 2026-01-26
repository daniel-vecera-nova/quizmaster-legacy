Feature: Edit question GUI
  - Question text is required
  - Answer text for each answer is required
  - At least one correct answer is required
  - Question explanation is optional

  Background:
    Given a question "What is the capital of Czech Republic?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * with explanation "Czechia is a country in Europe. Czechs love beer."
    * saved and bookmarked as "Czechia"
    And I check show explanations checkbox

  Scenario: Empty question form
    Given I enter question ""
    And I check show explanations checkbox
    * I enter answer 1 text "", incorrect, with explanation ""
    * I enter question explanation ""
    When I attempt to save the question
    Then I see error messages
      | empty-question    |
      | empty-answer |
      | empty-answer-explanation |

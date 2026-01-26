Feature: Edit question Show/hide explanation

  Scenario: Explanation fields are visible by default
    Given a question "What is the capital of Kambodia?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * saved and bookmarked as "Kambodia"
    When I start editing question "Kambodia"
    Then I see show explanation checkbox is checked
    And I see explanation fields are visible

  Scenario: Explanation fields are hidden when toggling "Show explanation" checkbox
    Given a question "What is the capital of Kambodia?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * saved and bookmarked as "Kambodia"
    When I start editing question "Kambodia"
    And I uncheck "Show explanation" checkbox
    Then I see show explanation checkbox is unchecked
    And I see explanation fields are not visible

  Scenario: Explanation fields are hidden when explanations are empty
    Given a question "What is the capital of Kambodia?"
    * with answers:
      | Brno   |   | |
      | Prague | * | |
      | Berlin |   | |
    * saved and bookmarked as "Kambodia"
    When I start editing question "Kambodia"
    Then I see show explanation checkbox is unchecked
    And I see explanation fields are not visible


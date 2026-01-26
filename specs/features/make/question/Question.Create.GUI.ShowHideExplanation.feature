Feature: Create question GUI - Show/hide choice explanations
  Show/hide explanation answer fields when toggling "Add explanation to your answer" checkbox

  Scenario: Explanation fields are hidden by default
    When I start creating a question
    Then I see show explanation checkbox is unchecked
    And I see explanation fields are not visible

  Scenario: Explanation fields are visible when toggling "Show explanation" checkbox
    When I start creating a question
    And I check "Show explanation" checkbox
    Then I see show explanation checkbox is checked
    And I see explanation fields are visible

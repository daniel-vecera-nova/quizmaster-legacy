Feature: Workspace - where workspace and quiz list are displayed

  Scenario: Take question in a workspace
    Given a workspace with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I take question "2 + 2 = ?" from the list
    Then I see the question and the answers

  Scenario: Copy a take question URL
    Given a workspace with question
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
    When I copy the take question URL "2 + 2 = ?" from the list
    And I follow the copied URL
    Then I see the question and the answers

  Scenario: Edit question in a workspace
    Given a workspace with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I edit question "2 + 2 = ?" from the list
    And I check show explanations checkbox
    Then I see question edit page
    And I see "2 + 2 = ?" in the question field

  Scenario: Copy an edit question URL
    Given a workspace with question
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
    When I copy the edit question URL "2 + 2 = ?" from the list
    And I follow the copied URL
    Then I see question edit page

  Scenario: Show edited question in a workspace
    Given a workspace with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
    When I edit question "2 + 2 = ?" from the list
    Then I see question edit page
    And I enter question "A + B = ?"
    When I submit the question
    Then I see question in list "A + B = ?"

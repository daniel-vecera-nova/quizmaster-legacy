Feature: Create Quiz from Workspace

  Background:
    Given a workspace with questions
      | question                       | answers            |
      |                      2 + 2 = ? |           4 (*), 5 |
      |                      3 * 3 = ? |           9 (*), 6 |
      |                      4 / 2 = ? |           2 (*), 3 |
      | Jaký nábytek má Ikea?          | Stůl (*), Auto     |
      | Jaké nádobí má Ikea?           | Talíř (*), Kolo    |
      | Jaký venkovní Nábytek má Ikea? | Židle (*), Triangl |

  Scenario: Create quiz and display it in quiz list
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter quiz description "Very hard math quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I submit the quiz
    Then I see the quiz "Math Quiz" in the workspace
    * I take quiz "Math Quiz"

  Scenario: Create quiz with 4 questions
    When I start creating a new quiz
    * I enter quiz name "Math Quiz"
    * I enter quiz description "Very hard math quiz"
    * I select question "2 + 2 = ?"
    * I select question "4 / 2 = ?"
    * I select question "Jaký nábytek má Ikea?"
    * I select question "Jaké nádobí má Ikea?"
    Then I see selected question count 4
    * I see total question count 6
    When I check randomized function
    * I enter number of randomized questions in quiz 3
    * I submit the quiz
    * I take quiz "Math Quiz"
    Then I see the welcome page
    * I see quiz name "Math Quiz"
    * I see quiz description "Very hard math quiz"
    * I see question count 3

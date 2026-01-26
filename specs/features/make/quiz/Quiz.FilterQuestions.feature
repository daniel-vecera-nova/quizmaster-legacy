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

  Scenario Outline: Filter questions in quiz creation form
    When I start creating a new quiz
    And I filter questions by "<filter>"
    Then I see quiz question "<visibleQuestion1>"
    And I see quiz question "<visibleQuestion2>"
    And I don't see quiz questions "<hiddenQuestion1>"
    And I don't see quiz questions "<hiddenQuestion2>"

    Examples:
      | filter  | visibleQuestion1      | visibleQuestion2               | hiddenQuestion1 | hiddenQuestion2       |
      |       2 |             2 + 2 = ? |                      4 / 2 = ? |       3 * 3 = ? | Jaký nábytek má Ikea? |
      | Ikea    | Jaký nábytek má Ikea? | Jaké nádobí má Ikea?           |       2 + 2 = ? |             3 * 3 = ? |
      | nábytek | Jaký nábytek má Ikea? | Jaký venkovní Nábytek má Ikea? |       2 + 2 = ? |             4 / 2 = ? |

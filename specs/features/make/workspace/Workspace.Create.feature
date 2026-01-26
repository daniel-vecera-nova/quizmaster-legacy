Feature: Create workspace

  Scenario: Create workspace
    Given I start creating a workspace
    * I enter workspace name "My List"
    When I submit the workspace
    Then I see the "My List" workspace page
    * I see an empty workspace

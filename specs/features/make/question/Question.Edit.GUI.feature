Feature: Edit question GUI

  Background:
    Given a question "What is the capital of Czech Republic?"
    And I check show explanations checkbox
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * with explanation "Czechia is a country in Europe. Czechs love beer."
    * saved and bookmarked as "Czechia"

  Scenario: Prepopulated form fields
    When I check show explanations checkbox
    Then I see "What is the capital of Czech Republic?" in the question field
    * I see multiple choice is unchecked
    * I see the answers fields
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * I see "Czechia is a country in Europe. Czechs love beer." in the question explanation field

  Scenario: Edit all fields
    Given I enter question "What is the capital of Slovakia?"
    When I check show explanations checkbox
    * I enter answer 1 text "It's Brno", incorrect, with explanation "No, it's not Brno"
    * I enter answer 2 text "It's Prague"
    * I enter answer 2 explanation "No, it's not Prague"
    * I enter answer 3 text "It's Bratislava", correct, with explanation "Yes!"
    * I enter question explanation "Slovakia is a country in Europe. Slovaks love borovička."

    When I submit the question
    * I refresh the page

    Then I see "What is the capital of Slovakia?" in the question field
    * I see multiple choice is unchecked
    * I check show explanations checkbox
    * I see the answers fields
      | It's Brno       |   | No, it's not Brno   |
      | It's Prague     |   | No, it's not Prague |
      | It's Bratislava | * | Yes!                |
    * I see "Slovakia is a country in Europe. Slovaks love borovička." in the question explanation field

  Scenario: Change single choice to multiple choice
    Given I mark the question as multiple choice
    * I mark answer 1 as correct
    When I submit the question
    * I refresh the page
    Then I see answer 1 as correct
    * I see answer 2 as correct
    * I see answer 3 as incorrect

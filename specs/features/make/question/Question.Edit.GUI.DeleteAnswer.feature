Feature: Edit question GUI - delete answer

  Scenario: Delete one of the prepopulated form fields
    Given a question "What is the capital of Czech Republic?"
    * with answers:
    | Brno   |   | No Brno |
    | Prague | * | Yes     |
    | Berlin |   | Germany |
    * with explanation "Czechia is a country in Europe. Czechs love beer."
    * saved and bookmarked as "Czechia"
    Then I see "What is the capital of Czech Republic?" in the question field
    * I see 3 delete buttons enabled
    * I delete answer 3
    * I see the answers fields
      | Brno   |   | No Brno |
      | Prague | * | Yes     |

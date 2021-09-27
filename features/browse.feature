@foo
Feature: Guest user checks main page of Fusion Store

  Background: Navigation
    Given Go to the main page of Fusion Store

  Scenario: Guest user checks details of application created by the Finastra user
    When User searches application by "Finastra"
    Then Results list has more than 0 items

# When User opens details of 1st application
# Then Results list contains "FusionStore - Finastra Marketplace -"
# Then results list contains <section>
#   | section         |
#   | App information |
#   | Privacy policy  |

# When <tab> is actve
#   | tab             |
#   | Building Blocks |
# Then user opens <tab>
# And user closes details of application
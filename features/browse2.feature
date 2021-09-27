@foo
Feature: Guest user checks main page of Fusion Store - 2nd test

  Background: Navigation
    Given Go to the main page of Fusion Store - 2nd test

  Scenario: Guest user checks details of application created by the Active title
    When User searches application by "Active" title
    Then List has more than 0 items

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
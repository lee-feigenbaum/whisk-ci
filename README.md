# whisk-ci
Save CooksIllustrated.com recipes to Whisk.com

# Milestones

## Design / user flow

1. Extension button enabled on a CI property website (equally ergonomic compared to injecting a button into the page UI, limits the dependency on the page structure to the parsing only)
2. Clicking the button saves the recipe to my Whisk recipes

Additional enhancements down the line would see if the recipe already exists in Whisk to avoid making dupes (but can be skipped in MVP) and might present the parsed metadata to the user before saving to make sure that it's accurate. Other enhancements might link through to the saved recipe.

## Content + background framework established for dev

Finished when the basic pieces are in place to pull something out of a content page and pass it to the background script which can simply log/display it, and when a cycle for dev / test / reload is in place.

1/25

## Initial parsing

Finished when I can parse a single recipe and display its component pieces in the extension

### Parsing Strategy for Example CI Recipe

Gather this Information:
* Title: metadata
* Image: metadata
* Services: metadata + parsing text ("Serves 8 to 10")
* Source: metadata (url)
* Description: metadata ('description') + parse "Before you Begin" (div .recipe-instructions-headnote__body)??
* Ingredients: ?? - recipe-ingredient-groups--main recipe-ingredient-group__list-item (or span w/ ingredient__title class)
* Instructions: ?? - recipe-instruction__content (div)

## Robust parsing

Finished when I can parse recipes from multiple CI sites and from multiple "generations" (older/newer)

OK 1/25

## Whisk comms / save a recipe

Finished when I can save to Whisk's API.
Will need to include whatever sort of OAuth / other auth for this to be usable by anyone else. Want to do that part reasonably well.


## Fit and finish

Polish UI.
Icons & metadata.
Refine logic for enabling/disabling extension button
Handle parse / save errors.
Enhancements to above flow.
Packaging for self.
Packaging for others?

## QUESTIONS

* What's the difference between using chromes.tab.query with active window and active tab true vs. using chrome.tabs.getSelected (per https://stackoverflow.com/questions/32777310/messaging-between-content-script-and-background-page-in-a-chrome-extension-is-no/32779463) [latter deprecated]
* Should ShowPageAction be graying out the icon or do I need to do that explicitly myself?

## NOTES

* OAuth library linked from Chrome extension docs: http://unitedheroes.net/OAuthSimple/js/OAuthSimple.js

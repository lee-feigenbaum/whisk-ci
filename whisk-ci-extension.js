'use strict';

// Functionality specific to parsing recipes from CI sites
// and saving to Whisk

async function saveRecipe(element) {
  console.log("*** BACKGROUND finding active tab and sending message");
  await chromeRuntimeSendMessageAsync({message: 'PopupInfo', info: 'Parsing recipe information from page...'});

  let tabs = await chromeTabsQueryAsync({active: true, currentWindow: true});
  let recipe = new Recipe(await chromeTabsSendMessageAsync(tabs[0].id, { message: 'ParseRecipe' }));
  console.log("*** BACKGROUND received recipe response - %o - from tab %o", recipe, tabs[0]);

  // Use the Whisk API to store the recipe
  await chromeRuntimeSendMessageAsync({message: 'PopupInfo', info: `Saving recipe ${recipe.name} with Whisk...`});
  const whiskAPIFactory = new WhiskAPIRecipeFactory();
  const whiskResponse = await whiskAPIFactory.save(recipe);

  const recipeUrl = `https://my.whisk.com/recipes/${whiskResponse.recipe.id}`;
  await chromeRuntimeSendMessageAsync({message: 'PopupInfo', info: `Saved <a href="${recipeUrl}">recipe</a> to Whisk!`});
  chrome.tabs.create({
    active: true,
    index: tabs[0].index + 1,
    url: recipeUrl
  });

  // Store the recipe locally
  //const localStorageFactory = new LocalStorageRecipeFactory();
  //await localStorageFactory.save(recipe);

  // Navigate to manual recipe add page and pass this recipe ID - this Will
  // trigger the add recipe content script which will pass a message back
  // to the extension to get the recipe & form fill it
  //chrome.tabs.create({
  //  active: true,
  //  index: tabs[0].index + 1,
  //  url: 'https://my.whisk.com/recipes/new?recipe_opened_from=Recipes%20Page&with_back_action=1&recipe_to_save=' + recipe.id + '&autofill=1'
  //});
}

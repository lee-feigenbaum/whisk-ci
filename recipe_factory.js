'use strict';

class RecipeFactory {
  constructor() {

  }

  async save(recipe) { throw new Error("Must subclass RecipeFactory#save"); }

  async load(recipe_id) { throw new Error("Must subclass RecipeFactory#load"); }
}

class WhiskAPIRecipeFactory extends RecipeFactory {
  async save(recipe) {
    const body = recipe.toWhiskJSON();
    console.log(`POSTing the following to https://graph.whisk.com/v1/recipes:\n${body}`);

    const bearer_token_storage = await chromeLocalStorageGetAsync("whisk_bearer_token");

    const response = await fetch(
      "https://graph.whisk.com/v1/recipes",
      {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + bearer_token_storage["whisk_bearer_token"],
          "Content-Type": "application/json",
        },
        body: body,
      },
    )
    if (!response.ok) {
      const responseText = await response.text();
      throw(`Saving to Whisk failed with code ${response.status} / ${response.statusText} / ${responseText}`);
    }
    const apiResponse = await response.json();
    return apiResponse;
  }

  async load(recipe_id) {
    throw("Not yet able to load recipes from Whisk");
  }

}

class LocalStorageRecipeFactory extends RecipeFactory {
  async save(recipe) {
    const storage = {};
    if (!recipe) {
      console.warn("*** BACKGROUND - blank recipe passed to save");
      debugger;
    }
    storage[recipe.id] = recipe;
    await chromeLocalStorageSetAsync(storage);
    console.log('STORED recipe ' + recipe.id);
  }

  async load(recipe_id) {
    let results = await chromeLocalStorageGetAsync(recipe_id);
    return results[recipe_id];
  }

  async remove(recipe_id) {
    if (typeof recipe_id != "string") {
      recipe_id = recipe.id; // recipe object
    }
    await chromeLocalStorageRemoveAsync(recipe_id);
    console.log('REMOVED recipe ' + recipe_id);
  }
}

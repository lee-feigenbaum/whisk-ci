'use strict';

async function addRecipe () {

  console.log("CONTENT (Whisk): parsing out recipe name");
  const recipe_id = new URLSearchParams(window.location.search).get('recipe_to_save');

  console.log("CONTENT (Whisk): waiting for load of recipe");
  const recipe = new Recipe(await chromeRuntimeSendMessageAsync({'message': 'LoadRecipe', 'recipe_id': recipe_id}));
  console.log("CONTENT SCRIPT (Whisk): Loaded recipe: %o", recipe.id);

  // ingredients is the unnamed textarea under
  const recipeToWhisk = {
    name: 'name',
    description: 'description',
    servings: 'servings'

  };
}

async function addRecipeOnPageLoad() {
  await setTimeoutAsync(2000);
  addRecipe();
}

addRecipeOnPageLoad();

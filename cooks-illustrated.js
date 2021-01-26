let recipeMetadata = () => {
  const matches = document.querySelectorAll('script[type="application/ld+json"]');
  if (matches.length != 1) {
    console.log("*** No JSON+LD metadata found.");
    return null;
  }
  console.log("*** CONTENT found JSON+LD metadata");
  return JSON.parse(matches[0].textContent);
};

let testMetadataKeysString = () => {
  return Object.keys(recipeMetadata()).join(" ~ ");
};

// https://docs.whisk.com/api/recipes/user-recipes-and-collections/create-a-recipe
let parseRecipe = () => {
  const recipe = {
    "name": null,
    "description": null,
    "ingredients": [], // text & group
    "images": [], // url
    "instructions": {"steps": []}, // steps: [{text, group, images}]
    "durations": [], // cookTime, prepTime, totalTime
    "source": null, // name, displayName, sourceRecipeUrl, license, image
    "servings": null
  };

  const metadata = recipeMetadata();

  //debugger;
  if (!metadata) {
    return null;
  }

  recipe["name"] = metadata["name"];
  recipe["description"] = metadata["description"];
  recipe["images"] = [{"url": metadata["image"]}];
  recipe["source"] = {"source_recipe_url": metadata["url"]}; // also display_name

  const recipeYield = metadata["recipeYield"];
  const servings = recipeYield.match(/(\d+)/)
  if (servings) {
    recipe["servings"] = Number(servings[0]);
  }

  const beforeWeBegin = document.querySelector("div.recipe-instructions-headnote__body");
  if (beforeWeBegin) {
    recipe["description"] += "\n\n" + beforeWeBegin.textContent;
  }

  const ingredientGroups = document.querySelectorAll("div.recipe-ingredient-group");
  for (const group of ingredientGroups) {
    const groupTitle = group.querySelector(".recipe-ingredient-group__title");
    let groupTitleText = groupTitle ? groupTitle.textContent : null;
    for (const ingredient of group.querySelectorAll("div.recipe-ingredient-group__list-item")) {
      recipe["ingredients"].push({"group": groupTitleText, "text": ingredient.textContent});
    }
  }

  for (const instruction of document.querySelectorAll("div.recipe-instruction__content")) {
    recipe["instructions"]["steps"].push({"text": instruction.textContent});
  }

  return recipe;
};

console.log("*** CONTENT registering message listener");
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	//console.log("*** CONTENT received %o from %o, frame", msg, sender.tab, sender.frameId);
  console.log("*** CONTENT sending respose to background script")
  sendResponse(parseRecipe());
});

'use strict';

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
    //"durations": [], // cookTime, prepTime, totalTime
    "source": null, // name, display_name, url,image{} OR displayName, sourceRecipeUrl, license, image
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

  const url = metadata["url"];
  const hostname = new URL(url).hostname;
  recipe["source"] = {"sourceRecipeUrl": url, "displayName": hostname}; // also display_name

  const recipeYield = metadata["recipeYield"];
  const servings = recipeYield.match(/(\d+)/)
  if (servings) {
    recipe["servings"] = Number(servings[0]);
  }

  const beforeWeBegin = document.querySelector("div.recipe-instructions-headnote__body");
  if (beforeWeBegin) {
    recipe["description"] += "\n\n" + beforeWeBegin.textContent;
  }

  // <em class="recipe-detail-page__meta--label">TIME</em><span class="recipe-detail-page__meta--value">2¼ hours</span>
  for (const metaLabel of document.querySelectorAll(".recipe-detail-page__meta--label")) {
    const label = metaLabel.textContent;

    if (label == "TIME") {
      let timeValue = metaLabel.nextSibling.textContent
        .replace(/\s*¼/, ".25")
        .replace(/\s*⅓/, ".33")
        .replace(/\s*½/, ".5")
        .replace(/\s*⅔/, ".67")
        .replace(/\s*¾/, ".75");

      let minutes = 0;

      const hoursMatch = timeValue.match(/([.\d]+)\s*hour/i);
      const minutesMatch = timeValue.match(/([.\d]+)\s*min/i);

      if (hoursMatch) {
        minutes += (60 * hoursMatch[1]);
      }
      if (minutesMatch) {
        minutes += Number(minutesMatch[1]);
      }

      if (minutes > 0) {
        recipe["durations"] = {"cookTime": Math.round(minutes)}; // maybe total_time?
      }

    }
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
  console.log("*** CONTENT sending respose to background script")
  sendResponse(parseRecipe());
});

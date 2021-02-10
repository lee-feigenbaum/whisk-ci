'use strict';

//const recipe = {
//  "name": null,
//  "description": null,
//  "ingredients": [], // text & group
//  "images": [], // url
//  "instructions": {"steps": []}, // steps: [{text, group, images}]
//  "durations": {cook_time: ..., prep_time: ..., total_time: ...},
//  "source": null, // name, displayName, sourceRecipeUrl, license, image
//  "servings": null
//};

class Recipe {
  constructor(json = null) {
    if (json) {
      if (typeof json == 'string') {
        json = JSON.parse(json);
      } // otherwise it's already an object

      // copy all properties as-is
      Object.assign(this, json);
    }
  }

  get id() {
    this._id ||= this.name.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
    return this._id;
  }

  toWhiskJSON() {

    const whisk_obj = {
      collectionIds: [],
      payload: JSON.parse(JSON.stringify(this)),
    };

    // Not documented as such, but the Whisk API seems to expect a customLabels field on
    // each intsructions step that is serializable into a Set, so we give it one!
    ((whisk_obj.payload.instructions &&
      whisk_obj.payload.instructions.steps) || []).forEach(step => step.customLabels = []);

    return JSON.stringify(whisk_obj);
  }

}

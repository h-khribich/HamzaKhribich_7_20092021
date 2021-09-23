/* --- General --- */
import { recipes } from './recipes.js';

/* --- DOM Selection --- */
const mainGrid = document.getElementById('main-grid');

/* --- Displaying recipe cards --- */
// Loop through recipe object to display relevant info, then a second loop through ingredients to display them correctly
for (let i = 0; i < recipes.length; i++) {
  
  // Ingredients object within recipe object
  let ingredientsList = recipes[i].ingredients;
  // Variable to be filled with relevant li elements as ul children in mainGrid template literal
  let ingredients = '';

  for (let j = 0; j < ingredientsList.length; j++) {
    let quantity = ingredientsList[j].quantity;
    let unit = ingredientsList[j].unit;
    // Converting units to abbreviated form
    if (unit == 'grammes') { unit = 'g'} else if (unit == 'litres') { unit = 'l'};

    let ingredientName = `<strong>${ingredientsList[j].ingredient}</strong>`;
    
      // If ingredient's unit is not metric, display with a space (eg. pain: 2 tranches)
      if (quantity && unit && (unit.length > 2)) {
      ingredients += `<li>${ingredientName}: ${quantity} ${unit}</li>`;

      // If unit is metric, display without a space (eg. lait: 4ml)
    } else if (quantity && unit && (unit.length <= 2)) {
      ingredients += `<li>${ingredientName}: ${quantity}${unit}</li>`;

      // If no unit is available, display only quantity (eg. oignon: 1)
    } else if (quantity) {
      ingredients += `<li>${ingredientName}: ${quantity}</li>`;

      // Else, display ingredient only (eg. huile d'olive)
    } else {
      ingredients += `<li>${ingredientName}</li>`;
    }
  }

  // Recipe card HTML code injected
  mainGrid.innerHTML += 
  `<!-- Recipe card -->
      <div class="col">
        <div class="card h-100 shadow-sm recipe">
          <img src="assets/recipe_background.png" class="card-img-top" alt="">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-title recipe__title mb-3">${recipes[i].name}</h5>
              <p class="recipe__time"><i class="far fa-clock pe-2"></i>${recipes[i].time} min</p>
            </div>
            <div class="row recipe__text">
              <ul class="card-text col recipe__ingredients">${ingredients}</ul>
              <p class="card-text col recipe__description">${recipes[i].description}</p>
            </div>
          </div>
        </div>
      </div>`;
}

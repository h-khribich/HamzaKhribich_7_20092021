// General
import { recipes } from './recipes.js';

// DOM Selection
const mainGrid = document.getElementById('main-grid');

// Displaying recipe cards
for (let i = 0; i < recipes.length; i++) {
  
  // !!! Each ingredient in ingredients is its own object !!! //

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
              <p class="card-text col"></p>
              <p class="card-text col recipe__description">${recipes[i].description}</p>
            </div>
          </div>
        </div>
      </div>`;
}

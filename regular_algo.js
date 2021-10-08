/* --- GENERAL --- */
import { recipes } from './recipes.js'

/* --- DOM SELECTION --- */
const mainGrid = document.getElementById('main-grid')
const btnComponent = document.querySelectorAll('.btn-component')
const btnComponentInput = document.querySelectorAll('.btn-component__input')
const ingredientsBtnList = document.querySelector('.ingredients-list')
const appliancesBtnList = document.querySelector('.appliances-list')
const utensilsBtnList = document.querySelector('.utensils-list')
const searchbar = document.getElementById('searchbar')
const tagsContainer = document.querySelector('.tag__container')
const queryAlert = document.querySelector('.query-alert')
let displayedRecipesIds = []
let mainSearchMatches = []

/* --- BUTTON LISTS ARRAYS --- */
let ingredientsArray = []
let appliancesArray = []
let utensilsArray = []

/* --- DISPLAYING RECIPE CARDS --- */

// Loop through recipe object to display relevant info, then a second loop through ingredients to display them correctly
for (let i = 0; i < recipes.length; i++) {
  // Ingredients object within recipe object
  const ingredientsList = recipes[i].ingredients
  // Variable to be filled with relevant li elements as ul children in mainGrid template literal
  let ingredients = ''

  for (let j = 0; j < ingredientsList.length; j++) {
    const quantity = ingredientsList[j].quantity
    let unit = ingredientsList[j].unit
    // Converting units to abbreviated form
    if (unit === 'grammes') { unit = 'g' } else if (unit === 'litres') { unit = 'l' }

    const ingredientName = `<strong>${ingredientsList[j].ingredient}</strong>`

    // If ingredient's unit is not metric, display with a space (eg. pain: 2 tranches)
    if (quantity && unit && (unit.length > 2)) {
      ingredients += `<li>${ingredientName}: ${quantity} ${unit}</li>`

      // If unit is metric, display without a space (eg. lait: 4ml)
    } else if (quantity && unit && (unit.length <= 2)) {
      ingredients += `<li>${ingredientName}: ${quantity}${unit}</li>`

      // If no unit is available, display only quantity (eg. oignon: 1)
    } else if (quantity) {
      ingredients += `<li>${ingredientName}: ${quantity}</li>`

      // Else, display ingredient only (eg. huile d'olive)
    } else {
      ingredients += `<li>${ingredientName}</li>`
    }
  }

  // Recipe card HTML code injected
  mainGrid.innerHTML +=
  `<!-- Recipe card -->
      <div class="col recipe-card" data-id="${recipes[i].id}">
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
      </div>`

  displayedRecipesIds.push(recipes[i].id)
}

/* --- BUTTON COMPONENT --- */

// Opening and closing advanced search button
btnComponent.forEach((btn) => {
  const btnName = btn.querySelector('.btn-component__name')
  const btnInput = btn.querySelector('.btn-component__input')
  const btnList = btn.querySelector('.btn-component__list')
  const btnArrow = btn.querySelector('.btn-component__arrow')

  // Opening and closing functions
  const openBtn = () => {
    btn.classList.add('btn-active')
    btnName.classList.add('d-none')
    btnInput.classList.remove('d-none')
    btnList.classList.remove('d-none')
  }

  const closeBtn = () => {
    btn.classList.remove('btn-active')
    btnName.classList.remove('d-none')
    btnInput.classList.add('d-none')
    btnList.classList.add('d-none')
  }

  // Button click event can only open button (otherwise some clickable elements ie. tags would close it)
  btn.addEventListener('click', () => {
    // Clicking anywhere beyond the button closes it
    document.addEventListener('click', (event) => {
      if (!btn.contains(event.target) && btn.classList.contains('btn-active')) { closeBtn() }
    })
    openBtn()
  })

  // Arrow can open or close button depending on parent button
  btnArrow.addEventListener('click', (event) => {
    btn.classList.contains('btn-active') ? closeBtn() : openBtn()
    // Prevent arrow click from propagating and activating button
    event.stopPropagation()
  })
})

/* --- FILLING BUTTON LISTS --- */

// Display list items
const displayItem = (item) => `<li class="list-item"><a href="#">${item}</a></li>`

const fillBtnList = () => {
  // Clearing lists for updating
  ingredientsBtnList.innerHTML = ''
  appliancesBtnList.innerHTML = ''
  utensilsBtnList.innerHTML = ''
  ingredientsArray = []
  appliancesArray = []
  utensilsArray = []

  // Ingredients button
  recipes.forEach((recipe) => {
    if (displayedRecipesIds.includes(recipe.id)) {
      recipe.ingredients.forEach((obj) => {
        // Transform all to lowercase to eliminated differently spelled similar words
        let ingredient = obj.ingredient.toLowerCase()
        ingredient = ingredient.replace(ingredient[0], ingredient[0].toUpperCase())

        // Check ingredients in array for duplicates then push in appropriate list
        if (!ingredientsArray.includes(ingredient)) { ingredientsArray.push(ingredient) }
      })
    }
  })

  // Sorting ingredients according to french rules (accents) and displaying them
  ingredientsArray
    .sort((a, b) => a.localeCompare(b))
    .forEach((ingredient) => {
      ingredientsBtnList.innerHTML += displayItem(ingredient)
    })

  // Appliances button
  recipes.forEach((recipe) => {
    if (displayedRecipesIds.includes(recipe.id)) {
      let appliance = recipe.appliance
      // Transform all to lowercase to eliminated differently spelled similar words
      appliance = appliance.toLowerCase()
      appliance = appliance.replace(appliance[0], appliance[0].toUpperCase())

      if (!appliancesArray.includes(appliance)) { appliancesArray.push(appliance) }
    }
  })

  appliancesArray
    .sort((a, b) => a.localeCompare(b))
    .forEach((appliance) => {
      appliancesBtnList.innerHTML += displayItem(appliance)
    })

  // Utensils button
  recipes.forEach((recipe) => {
    if (displayedRecipesIds.includes(recipe.id)) {
      recipe.ustensils.forEach((item) => {
        let utensil = item.toLowerCase()
        utensil = utensil.replace(utensil[0], utensil[0].toUpperCase())

        if (!utensilsArray.includes(utensil)) { utensilsArray.push(utensil) }
      })
    }
  })

  utensilsArray
    .sort((a, b) => a.localeCompare(b))
    .forEach((utensil) => {
      utensilsBtnList.innerHTML += displayItem(utensil)
    })

  // Tag creation & input search event listner
  btnComponentInput.forEach((input) => {
    // Selecting appropriate sibling list
    const btnListItems = input
      .closest('.input-bloc')
      .closest('.btn-component')
      .querySelector('.btn-component__list')
      .querySelectorAll('.list-item')

    btnListItems.forEach((item) => {
      // Adding tags on list item click
      item.addEventListener('click', (event) => {
        event.preventDefault()

        // Check type of item so as to apply correct background color class
        let tagType = ''
        if (item.parentElement === ingredientsBtnList) {
          tagType = 'tag__ingredients'
        } else if (item.parentElement === appliancesBtnList) {
          tagType = 'tag__appliances'
        } else {
          tagType = 'tag__utensils'
        }

        // Add an id without apostrophes or spaces
        let tagId = item.innerText
        if (tagId.includes(' ')) { tagId = item.innerText.split(' ').join('') }
        tagId = tagId.replace('\'', '_')

        const newTag =
        `<li class="tag ${tagType}">
          <span class="tag__name">${item.innerText}</span>
          <button class="tag__close-button" id="${tagId}">
            <img src="assets/close-button.svg" alt="">
          </button>
        </li>`

        // Add new tag and update filtering
        tagsContainer.innerHTML += newTag
        updateTags(tagId)
      })
    })

    input.addEventListener('input', () => {
      // Search regex with input value as parameter
      const search = new RegExp(`(${input.value})`, 'i')
      console.log(search)

      btnListItems.forEach((item) => {
        // Hide item if it does not correspond to search regex else, show item
        !search.test(item.innerText) ? item.classList.add('d-none') : item.classList.remove('d-none')

        // Show all items when input field is empty
        if (input.value === '' && item.classList.contains('d-none')) { item.classList.remove('d-none') }
      })
    })
  })
}

// On load, fill buttons with already displayed items
window.addEventListener('load', fillBtnList())

// Hide displayed recipes that no longer match advanced search
const updateTags = (tagId) => {
  const filtering = () => {
    const tags = document.querySelectorAll('.tag__name')
    const cards = document.querySelectorAll('.recipe-card')
    let recipeList = []

    // If input is empty, search all recipes, else, search only in matching recipes
    searchbar.value === '' ? recipeList = cards : recipeList = mainSearchMatches

    // For each tag, match recipe, if recipe does not match all tags (global match), display it
    recipeList.forEach((card) => {
      let globalMatch = 0

      tags.forEach((tag) => {
        const matchingRecipe = recipes.filter(el => el.id === parseInt(card.dataset.id))

        let match = 0

        // Different loop for ingredients as they are one object deeper
        if (tag.parentElement.classList.contains('tag__ingredients')) {
          Object.values(matchingRecipe[0].ingredients).forEach((ingredient) => {
            if (Object.values(ingredient).includes(tag.innerText)) { match++ }
          })
        } else if (Object.values(matchingRecipe[0]).includes(tag.innerText) ||
        Object.values(matchingRecipe[0].ustensils).includes(tag.innerText.toLowerCase())) { match++ }

        if (match > 0) { globalMatch++ }
      })
      if (globalMatch < tags.length) {
        card.classList.add('d-none')
        card.classList.add(`hiddenCard${tagId}`)
        displayedRecipesIds = displayedRecipesIds.filter(el => el !== parseInt(card.dataset.id))
      }
      // Loading effect animation
      mainGrid.animate([
        { opacity: '1' },
        { opacity: '0' },
        { opacity: '1' }
      ], 950, 'ease-in-out')
    })
  }
  // Update item lists and relevant recipes
  filtering()
  fillBtnList()
  // ADD DISABLING ALREADY SELECTED ITEM

  // Tag close button event
  const tagCloseBtns = document.querySelectorAll('.tag__close-button')

  tagCloseBtns.forEach((button) => {
    const hiddenCards = document.querySelectorAll(`.hiddenCard${tagId}`)

    // On btn close, close all relevant recipes and filter again
    button.addEventListener('click', () => {
      hiddenCards.forEach((card) => {
        card.classList.remove('d-none')
        card.classList.remove(`hiddenCard${tagId}`)
        displayedRecipesIds.push(parseInt(card.dataset.id))
      })
      button.parentElement.remove()
      filtering()
      fillBtnList()
    })
  })
}

// Selecting all recipe cards
const recipeCards = document.querySelectorAll('.recipe-card')

/* --- MAIN SEARCHBAR ALGORITHM --- */
searchbar.addEventListener('input', () => {
  const mainSearch = new RegExp(`(${searchbar.value})`, 'i')

  // Clear displayed recipes
  displayedRecipesIds = []

  // Loop through cards to find search among children's innerText
  for (let i = 0; i < recipeCards.length; i++) {
    // Start after input of 3 characters
    if (searchbar.value.length >= 3) {
      const children = recipeCards[i].childNodes

      // For each child in the card or utensils in recipe obj, if a match has not been made, hide the carde
      let match = 0

      // Checking recipe card
      for (let j = 0; j < children.length; j++) {
        if (mainSearch.test(children[j].innerText)) {
          match++
          // If recipe id is not already in displayed recipes id, add it
          let checkId = 0
          for (let d = 0; d < displayedRecipesIds.length; d++) {
            if (recipeCards[i].dataset.id === displayedRecipesIds[d]) { checkId++ }
          }
          if (checkId === 0) { displayedRecipesIds.push(parseInt(recipeCards[i].dataset.id)) }
        }
      }

      // Display or hide card depending on match status and add to main search matches
      if (match === 0) {
        recipeCards[i].classList.add('d-none')
        mainSearchMatches = mainSearchMatches.filter(el => el.dataset.id !== recipeCards[i].dataset.id)
      } else {
        let searchMatch = 0
        for (let j = 0; j < mainSearchMatches.length; j++) {
          if (recipeCards[i].dataset.id === mainSearchMatches[j].dataset.id) { searchMatch++ }
        }
        if (searchMatch === 0) { mainSearchMatches.push(recipeCards[i]) }
        recipeCards[i].classList.remove('d-none')
        recipeCards[i].animate([
          {
            opacity: 0
          },
          {
            opacity: 1
          }
        ], 700, 'ease-in-out')
      }
      // If input is empty, show all and remove query alert if need be
    } else if (searchbar.value === '') {
      if (recipeCards[i].classList.contains('d-none')) { recipeCards[i].classList.remove('d-none') }
      let searchMatch = 0
      for (let j = 0; j < mainSearchMatches.length; j++) {
        if (recipeCards[i].dataset.id === mainSearchMatches[j].dataset.id) { searchMatch++ }
      }
      if (searchMatch === 0) { mainSearchMatches.push(recipeCards[i]) }
      // If all recipes are displayed, push their id so as to update button lists
      displayedRecipesIds.push(parseInt(recipeCards[i].dataset.id))
    }
  }
  // If no matches are found (all recipes hidden), display query alert
  if (!mainGrid.querySelector('div.recipe-card:not(.d-none)')) {
    queryAlert.classList.remove('d-none')
    // Alert animation
    queryAlert.animate([
      {
        opacity: 0,
        transform: 'translateY(-60px)'
      },
      {
        opacity: 1,
        transform: 'translateY(0)'
      }
    ], {
      duration: 550,
      easing: 'ease-in-out'
    })
  } else {
    queryAlert.classList.add('d-none')
    // Loading effect animation
    mainGrid.animate([
      { opacity: '0' },
      { opacity: '1' }
    ], 500, 'ease-in-out')
  }
  // Fill buttons with appropriate items from displayed recipes
  fillBtnList()
})

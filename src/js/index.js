//import str from './models/Search';
//import {add, mul, id} from './views/searchView';
//import * as searchView from './views/searchView';
//dot is for current folder
//console.log(`sum of 2 and 5 is ${add(2, 3)} and product is ${mul(2, 3)}, id is ${id}, string ${str}`);
//console.log(`using imported functions ${searchView.add(searchView.id, 2)} and ${searchView.mul(3, 5)}, ${str}`);
// import n from './test';
// const x = 23;
// console.log(`i imported ${n} from another module called test.js, variable x is ${x}`);
//https://forkify-api.herokuapp.com/api/search?q=pizza
// import axios from 'axios';

// async function getResult(query){
//     const proxy = 'https://cors-anywhere.herokuapp.com/';
//     try{
//   const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/search?q=${query}`);
//   const recipes = res.data.recipes;
//   console.log(recipes);
//     }
//     catch(error)
//     {
//         alert(error);
//     }
// };
// getResult('pasta');

import Search from './models/Search';
import Recipes from './models/Recipes';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clrLoader} from './views/base';
import { Stats } from 'webpack';
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 const state = {};
 // window.state = state;
 /** SEARCH CONTROLLER */

 const controlSearch = async () => {
     //1. get Query form user
     const query = searchView.getInput();
    //  console.log(query);
     if(query){
         //2. new search object and add it to state
         state.search = new Search(query);

         //3. Prepare UI fro results
            searchView.clearInput();
            searchView.clearResult();
            renderLoader(elements.searchRes);
            try{
         //4. Search for recipes
        await state.search.getResult();

         //5. Render results on UI
         clrLoader();
         searchView.renderResults(state.search.result);
           }
           catch(err){
               alert('something wrong with the search...');
               clrLoader();
           }

     }
 }
 elements.searchForm.addEventListener('submit', e => {
     e.preventDefault();
     controlSearch();
 });

 elements.searchResPages.addEventListener('click', el => {
    const button = el.target.closest('.btn-inline');
    console.log(button);
    if(button)
    {
        const gotoPage = parseInt(button.dataset.goto, 10);
        //base is 10
        searchView.clearResult();
        searchView.renderResults(state.search.result, gotoPage);
        console.log(gotoPage);
    }
 });


 /** RECIPE CONTROLLER */
//  const r = new Recipes(47746);
//  r.getRecipe();
//  console.log(r);

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id){
    //  1. prepare UI for changes
       recipeView.clearRecipe();
         renderLoader(elements.recipe);
        if(state.search)
         searchView.highlightSel(id);
    // 2. create new recipe object
        state.recipe = new Recipes(id);
        // testing
        // window.r = state.recipe;

     try{
    // 3. get recipe data
        await state.recipe.getRecipe();
        state.recipe.parseIng();
    // 4. calculate servings and time
       state.recipe.calcTime();
       state.recipe.calcServing();

    // 5. render Recipe
       clrLoader();
       recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
    catch(err)
    {
        alert('Error processing Recipe..');

    }
}

}


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//restore liked recipe on page load
window.addEventListener('load',  () => {
  state.likes = new Likes();

  state.likes.readStorage();

  likesView.toggleLikeMenu(state.likes.getLikes());

  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLikes(like));
})



// Handling recipe button click

/** LIST CONTROLLER */

const controlList = () => {
    if(!state.list)
    state.list = new List();

    //Add each ingredients to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *'))
    {
        //delete from state
        state.list.delItems(id);
        listView.delItems(id);
    }
    else if(e.target.matches('.shopping__count-value'))
    {
        const val = parseFloat(e.target.value, 10);
        if(val > 0)
        state.list.updateCount(id, val);
    }
})

//LIKE CONTROLLER
//for previously stored result
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getLikes());
const controlLike = () =>
{
    if(!state.likes)
    state.likes = new Likes();
    const cId = state.recipe.id;


    //user has not liked the current recipe
    if(!state.likes.isLiked(cId))
    {
        // Add like to the state
        const newLike = state.likes.addLike(cId,
             state.recipe.title,
              state.recipe.author,
              state.recipe.img);
        // Toggle the like button
        likesView.toggleLikedBtn(true);
      // Add like to UI list
      likesView.renderLikes(newLike);
        console.log(state.likes);

      }
          // User has liked the current recipe
    else{
        // Remove the like from state
        state.likes.deleteLike(cId);
        // Toggle the like button
        likesView.toggleLikedBtn(false);
        // Remove like from the UI
        likesView.deleteLike(cId);
    }
likesView.toggleLikeMenu(state.likes.getLikes());
}
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *'))
    //* used for any child of btn-decrease
    {
        //decrease btn is clicked
        if(state.recipe.serving > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIng(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *'))
    {
        //increase btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
      // add ingredient to shopping list
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *'))
    {
      // like controller
        controlLike();
    }

    // console.log(state.recipe);

});


//Local storage is a function that lives in window
/** localStorage setItem['id','1243'];
localStorage getItem['id']
output->'1243'
*/

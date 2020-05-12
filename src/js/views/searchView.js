// export const add = (a, b) => a + b;
// export const mul = (a, b) => a * b;
// export const id  = 2343;

import { elements } from "./base"

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSel = id => {

    const resArr = Array.from(document.querySelector('.results__link'));
    resArr.forEach(a => {
        a.classList.remove('results__link--active');
    })
   document.querySelector(`.result__link[href*="#${id}"]`).classList.add('results__link--active');
}
export const limitRecTitle = (title, limit = 17) => {
    const newArr = [];
    if(title.length > limit)
    {           /*

                a = accumulator = 0 --> a + curr = 5 newArr['pasta'];
                a = 5 --> a + curr = 9 newArr['pasta', 'with'];
                a = 9 --> a + curr = 15 newArr['pasta','with', 'tomato'];
                a  = 15 --> a + curr = 18 newArr['pasta','with', 'tomato'];
                a  = 18 --> a + curr = 24 newArr['pasta','with','tomato'];
                 */
           title.split(' ').reduce((a, curr) => {
            if(a + curr.length <= limit){
                newArr.push(curr);
            }
            return a + curr.length;
           }, 0);

           return `${newArr.join(' ')} ...`;
    }
return title;
}
export const renderRecipe = recipe =>{
    const markup =
    `<li><a class="results__link results__link--active" href="#${recipe.recipe_id}"><figure class="results__fig"><img src="${recipe.image_url}" alt="Test"></figure><div class="results__data"><h4 class="results__name">${limitRecTitle(recipe.title)}</h4><p class="results__author">${recipe.publisher}</p></div></a></li>`;
elements.searchResList.insertAdjacentHTML('beforeEnd', markup);
};

const createButton = (page, type) =>
     `<button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
       <span>Page ${type === 'prev' ? page - 1 : page + 1} </span>
       <svg class="search__icon">
               <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
         </svg>

     </button>
        `;

 const renderBtn = (page, numRes, resPerPage) => {
          const pgs = Math.ceil(numRes / resPerPage);
          let btn;
          if(page === 1 && pgs > 1){
              //buttton to go to next page
            btn = createButton(page, 'next');
          }else if(page < pgs)
          {
                //both button
                btn = `${createButton(page, 'prev')}
                        ${createButton(page, 'next')}`;
          }
          else if(page === pgs && pgs > 1){
              //button to go to previous page
              btn = createButton(page, 'prev');
          }
          elements.searchResPages.insertAdjacentHTML('afterBegin', btn);
};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
   //render result pf current page
    const s = (page - 1) * resPerPage;
    const e = page * resPerPage;

     recipes.slice(s, e).forEach(renderRecipe);
        //render page buttons
    renderBtn(page, recipes.length, resPerPage);
}

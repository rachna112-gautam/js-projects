export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elStrings = {
    loader: 'loader'
}
export const renderLoader = p => {
    const loader = `<div class = ${elStrings.loader}>
      <svg>
            <use href="img/icons.svg#icon-cw"></use>
            </svg>
            </div>`;
     p.insertAdjacentHTML('afterBegin', loader);
};

export const clrLoader = () => {
    const loader = document.querySelector(`.${elStrings.loader}`);
    if(loader)
    loader.parentElement.removeChild(loader);
};


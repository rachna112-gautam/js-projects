import axios from 'axios';
// import proxy from '../config';
export default class Recipes{
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
      try {
        const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        // console.log(res);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
      }
      catch(err){
          alert(err);
          alert('Something went wrong :(');
      }
    }

    calcTime(){
      const numIngre = this.ingredients.length;
      const period = Math.ceil(numIngre / 3);
      this.time = period * 15;
    }

    calcServing(){
      this.serving = 4;
    }

    parseIng(){

      const units = ['tablespoons', ' tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds',];
      const unit = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
      const unitshort = [...unit, 'kg','g'];
      const newIng = this.ingredients.map(e => {
          // 1. uniform units
          let ing = e.toLowerCase();
          units.forEach((cur, i ) => {
            ing = ing.replace(cur, unit[i]);
          });
          // 2. remove paranthesis
            ing = ing.replace(/ *\([^)]*\) */g, ' ');
          // 3. parse ingredients into unit, count and ingredient
            const arrIng = ing.split(' ');
            const unitIndex = arrIng.findIndex(el => unitshort.includes(el));
            let obj;
            if(unitIndex > -1)
            {
              // there is  a unit
              //Ex 2 1/2 cnt = [2, 1/2];
              const cnt = arrIng.slice(0, unitIndex);
              let count;
              if(cnt.length === 1)
              {
                count = eval(arrIng[0].replace('-', '+'));
              }
              else{
                count = eval(arrIng.slice(0, unitIndex).join('+'));
              }
              obj = {
                count,
                unit: arrIng[unitIndex],
                ingredient:arrIng.slice(unitIndex + 1).join(' ')
              }

            }else if(parseInt(arrIng[0], 10))
            {
              // there is no unit but first element is a number
              obj = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
              }
            }
            else if(unitIndex === -1)
            {
              //there is no unit

              obj = { 
                count: 1,
                unit: '',
                //ingredient: ingredient can be written as ingredient 
                ingredient: ing


              }
            }
         return obj;
      });
      this.ingredients = newIng;
    }

    updateServings (type) {
      //servings
        const newServ = type === 'dec' ? this.serving - 1 : this.serving + 1;
      
      //ingredients
      this.ingredients.forEach(ing => {
        ing.count *= (newServ / this.serving);
      });

      this.serving = newServ;
    }
}
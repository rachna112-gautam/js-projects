// export default 'I am an exported string';
import axios from 'axios';
// import proxy from '../config';
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async  getResult(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try{
      const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/search?q=${this.query}`);
    
      this.result = res.data.recipes;
    //  console.log(this.result);
        }
        catch(error)
        {
            alert(error);
        }
    }
}
//https://forkify-api.herokuapp.com/api/search?q=pizza




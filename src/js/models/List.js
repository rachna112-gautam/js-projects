import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id : uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    delItems (id){
       const index = this.items.findIndex(el => el.id === id);
        //splice takes start and number of elements as arguments while slice accepts the start and end index and doesnot mutate the original array
        //[2, 4, 5] splice(1, 1) ->returns 4, original [2,5]
        //[2, 4, 5] slice(1, 2) -> returns 4, original [2, 4, 5]
       this.items.splice(index, 1);
    }

    updateCount(id, cnt) {
        this.items.find(el => el.id === id).count = cnt;
    }
}
//intventory class
class Intventory {
    // static storageAreaList = []
    constructor() {
       this.storageAreaList = []
        
    }
    // add new storearea
    addNewStorageArea(name,type, room="kichen"){
      this.storageAreaList.push(new StorageArea(name, type,room))
    }

    getStorageArea(id){
        // gett filter array
        const tempList = this.storageAreaList.filter(function (storageArea){
            return storageArea.StorageAreaID ==id
        })
        // just need the only object in the array
       return tempList[0]
    }

    addNewItemToStorageArea(storageAreaID, itemName, itemType, itemExpirationDate, itemAmount, itemLocation){
        let storageArea = this.getStorageArea(storageAreaID)
    //   add new to staorage area
        storageArea.addNewItem(itemName, itemType, itemExpirationDate, itemAmount, storageArea.name)
    }

    
}

// storage area class
class StorageArea{
    static id = 0
    constructor(name, type, room){
        StorageArea.id++;
        this.StorageAreaID = StorageArea.id;
        this.name = name;
        this.type = type;
        this.room = room;
        // list of items
        this.itemList = []
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    sortedList(){
        this.itemList.sort(  (a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            
            // names must be equal
            return 0;
            })
          
    }
    
    sortIntoCategories(){            
        const groupedInt =  this.itemList.reduce((groupedItems, item)=>
        {
             const name = item.name
             if (groupedItems[name] == null) groupedItems[name]= []
             groupedItems[name].push(item)
            // https://flaviocopes.com/how-to-sort-array-by-date-javascript/
            groupedItems[name].sort((a, b) => b.expirationDate - a.expirationDate)
             return groupedItems
        },{})
        
        return groupedInt
}
    

    
    // edit storeageArea
    editStorageArea(){
    
    }
    
    addNewItem(name, type, date, amount ,loction){
        this.itemList.push(new Item(name,type, date, amount ,loction))
    }

    removeItem(id){
        this.itemList = this.itemList.filter((item)=>{
            return item.itemID != id
        })
    }
    

    removeToDifferentStoreage(storageAreaID){

    }
}

class Item{
    static id = 0;
    constructor(name, type, expirationDate, amount,location){
        Item.id++;
        this.itemID = Item.id;
        this.name = name;
        this.type = type;
        this.expirationDate = new Date(expirationDate);
        this.amount = amount;
        this.location = location;
    }
    moveItem(){

    }
    editItem(){

    }
    deleteItem(){

    }
}
// add new item
// move
// edit item
// delete item


// search for items

// testing------------
const intventory1 = new Intventory()
intventory1.addNewStorageArea('wallCabinet-1',"roomTemp")
intventory1.addNewStorageArea('baseCabinet-1',"roomTemp")
intventory1.addNewStorageArea('wallCabinet-2',"roomTemp")
intventory1.addNewStorageArea('baseCabinet-2',"roomTemp")

console.log(intventory1.storageAreaList)
console.log("get-1",intventory1.getStorageArea(2))
intventory1.addNewItemToStorageArea(2, "whiterRice", "roomTemp", "2024-2-6", "14oz")
intventory1.addNewItemToStorageArea(2, "whiterRice", "roomTemp", "2024-3-6", "14oz")
intventory1.addNewItemToStorageArea(2, "whiterRice", "roomTemp", "2024-1-6", "14oz")
intventory1.addNewItemToStorageArea(2, "beans", "roomTemp", "2024-12-6", "14oz")
intventory1.addNewItemToStorageArea(2, "beans", "roomTemp", "2024-5-6", "14oz")
intventory1.addNewItemToStorageArea(2, "beans", "roomTemp", "2024-6-6", "14oz")

 intventory1.getStorageArea(2).sortedList()
 const x = intventory1.getStorageArea(2).sortIntoCategories()
console.log("get-2", intventory1.getStorageArea(2).itemList)
console.log('x',x)

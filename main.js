//Inventory class
class Inventory {
    // static storageAreaList = []
    constructor() {
        this.storageAreaList = []
        this.container = document.getElementById('container')
        this.createStorageArea = document.getElementById("storage-area-form")
        this.storageAreaNameInput = document.getElementById("storage-area-name")
        this.storageAreaTypeInput = document.getElementById("storage-area-type")
        this.createStorageArea.addEventListener('submit', (e) => {
            e.preventDefault()

            const name = this.storageAreaNameInput.value
            const type = this.storageAreaTypeInput.value
            const newStorageArea = new StorageArea(name, type)
            this.addNewStorageArea(newStorageArea)
            newStorageArea.display(this)
        })
    }
    // add new storearea
    addNewStorageArea(storageArea) {
        this.storageAreaList.push(storageArea)
        let storageArea_list = JSON.stringify(this.storageAreaList)
        localStorage.setItem("storageArea_list", storageArea_list)
    }

    getStorageArea(id) {
        // gett filter array
        const tempList = this.storageAreaList.filter(function (storageArea) {
            return storageArea.storageAreaID == id
        })
        // just need the only object in the array
        return tempList[0]
    }

    addNewItemToStorageArea(storageAreaID, itemName, itemType, itemExpirationDate, itemAmount, itemLocation) {
        let storageArea = this.getStorageArea(storageAreaID)
        //   add new to staorage area
        // storageArea.addNewItem(itemName, itemType, itemExpirationDate, itemAmount, storageArea.name)
    }
     



}

// storage area class
class StorageArea {
    static id = 0
    constructor(name, type, room = 'kitchen') {
        StorageArea.id++;
        this.storageAreaID = StorageArea.id;
        this.name = name;
        this.type = type;
        this.room = room;
        // list of items
        this.itemList = []
        
    }



    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    sortedList() {
        this.itemList.sort((a, b) => {
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

    sortIntoCategories() {
        const groupedInt = this.itemList.reduce((groupedItems, item) => {
            const name = item.name
            if (groupedItems[name] == null) groupedItems[name] = []
            groupedItems[name].push(item)
            // https://flaviocopes.com/how-to-sort-array-by-date-javascript/
            groupedItems[name].sort((a, b) => b.expirationDate - a.expirationDate)
            return groupedItems
        }, {})

        return groupedInt
    }
    display(inventory) {
        const section = document.createElement('section')
        const div = document.createElement('div')
        section.classList.add('storage-area')
        section.setAttribute('id', `storage-area-${this.storageAreaID}`)
        const h2 = document.createElement('h2')
        h2.appendChild(document.createTextNode(this.name))
        const button = document.createElement("button")
        button.appendChild(document.createTextNode("remove storage area"))
        button.addEventListener('click', ()=>{
            console.log("deleteStorageArea")
            this.deleteStorageArea(inventory, section)
        })
        const form = this.itemForm(inventory)
        div.appendChild(h2)
        div.appendChild(button)
        div.appendChild(form)
        section.appendChild(div)
        section.appendChild(form)
        inventory.container.appendChild(section)

        this.handleForm(inventory)

    }
    // edit storeageArea
    editStorageArea() {

    }

    // display item form
    itemForm() {
        const form = document.createElement("form")
        form.setAttribute('id', `item-form-${this.storageAreaID}`)
        const nameInput = document.createElement("input")
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('name', 'item-name');
        nameInput.setAttribute('id', `item-name-${this.storageAreaID}`);
        nameInput.setAttribute('class', 'form-input');
        nameInput.setAttribute('size', 50);
        nameInput.setAttribute('placeholder', 'NAME');
        nameInput.setAttribute('required', 'required');
        form.appendChild(nameInput);
        const typeInput = document.createElement("input")
        typeInput.setAttribute('type', 'text');
        typeInput.setAttribute('name', 'item-type');
        typeInput.setAttribute('id', `item-type-${this.storageAreaID}`);
        typeInput.setAttribute('class', 'form-input');
        typeInput.setAttribute('size', 50);
        typeInput.setAttribute('placeholder', 'TYPE');
        typeInput.setAttribute('required', 'required');
        form.appendChild(typeInput);
        const dateInput = document.createElement("input")
        dateInput.setAttribute('type', 'text');
        dateInput.setAttribute('name', 'item-date');
        dateInput.setAttribute('id', `item-date-${this.storageAreaID}`);
        dateInput.setAttribute('class', 'form-input');
        dateInput.setAttribute('size', 50);
        dateInput.setAttribute('placeholder', 'year-month-day');
        dateInput.setAttribute('required', 'required');
        form.appendChild(dateInput);
        const amountInput = document.createElement("input")
        amountInput.setAttribute('type', 'text');
        amountInput.setAttribute('name', 'item-type');
        amountInput.setAttribute('id', `item-amount-${this.storageAreaID}`);
        amountInput.setAttribute('class', 'form-input');
        amountInput.setAttribute('size', 50);
        amountInput.setAttribute('placeholder', 'AMOUNT');
        amountInput.setAttribute('required', 'required');
        form.appendChild(amountInput);
        const button = document.createElement('button')
        button.setAttribute('type', 'submit')
        button.appendChild(document.createTextNode("Add Item"))
        form.appendChild(button)
        return form
    }

    handleForm(inventory) {
        const createItem = document.getElementById(`item-form-${this.storageAreaID}`)
        const itemNameInput = document.getElementById(`item-name-${this.storageAreaID}`)
        const itemTypeInput = document.getElementById(`item-type-${this.storageAreaID}`)
        const itemDateInput = document.getElementById(`item-date-${this.storageAreaID}`)
        const itemAmountInput = document.getElementById(`item-amount-${this.storageAreaID}`)

        createItem.addEventListener(
            'submit', (e) => {
                e.preventDefault()
                const name = itemNameInput.value
                const type = itemTypeInput.value
                const date = itemDateInput.value
                const amomount = itemAmountInput.value
                const newItem = new Item(name, type, date, amomount, this.name)
                this.addNewItem(newItem, inventory)
                newItem.display(this, inventory)
            }
        )
    }
    addNewItem(item, inventory) {
        this.itemList.push(item)
        let storageArea_list = JSON.stringify(inventory.storageAreaList)
        localStorage.setItem("storageArea_list", storageArea_list)
        
    }

    deleteStorageArea(inventory, section) {
        inventory.storageAreaList = inventory.storageAreaList.filter((storageArea)=>{
            return storageArea.storageAreaID != this.storageAreaID
        })
        let storageArea_list = JSON.stringify(inventory.storageAreaList)
        localStorage.setItem("storageArea_list", storageArea_list)
        section.remove()
    }


    removeToDifferentStoreage(storageAreaID) {

    }
}

class Item {
    static id = 0;
    constructor(name, type, expirationDate, amount, location) {
        Item.id++;
        this.itemID = Item.id;
        this.name = name;
        this.type = type;
        this.expirationDate = new Date(expirationDate);
        this.amount = amount;
        this.location = location;
    }
    display(storage, inventory){
  
        const div = document.createElement('div')
        div.classList.add("food-item")
        div.setAttribute('id', `food-item${this.itemID}`)
        const p = document.createElement('p')
        p.appendChild(document.createTextNode(this.name))
        const span = document.createElement("span")
        span.appendChild(document.createTextNode(this.expirationDate))
        p.appendChild(span)
        div.appendChild(p)
        const button = document.createElement("button")
        button.appendChild(document.createTextNode("remove item"))
        div.appendChild(button)
        button.addEventListener('click', ()=>{
            this.deleteItem(storage, div)
            let storageArea_list = JSON.stringify(inventory.storageAreaList)
            localStorage.setItem("storageArea_list", storageArea_list)
            
        })
        const section = document.getElementById(`storage-area-${storage.storageAreaID}`)
        section.appendChild(div)
        return

    }
    moveItem(storage, div) {

    }
    editItem() {

    }
    deleteItem(storage, div) {
        const filterArray = storage.itemList.filter((item)=>{
            return item.itemID != this.itemID
        })
       storage.itemList = filterArray
        div.remove()
    }
}
// add new item
// move
// edit item
// delete item


// search for items

// testing------------

// const inventory1 = new Inventory()
// function stringifyIn
let inventory1 = new Inventory()


// from local storage
if (localStorage.getItem("storageArea_list") == undefined) {
    console.log("No localStorage storageArea_list")
}
else{
    console.log('List')
    let tempList = JSON.parse(localStorage.getItem("storageArea_list"))
    for(i=0; i < tempList.length; i++){
        console.log(tempList[i])
        const newStorageArea = new StorageArea(tempList[i].name, tempList[i].type)
        inventory1.addNewStorageArea(newStorageArea)
        newStorageArea.display(inventory1)
        
        for(j=0; j < tempList[i].itemList.length; j++){
        let newItem = new Item(tempList[i].itemList[j].name, tempList[i].itemList[j].type, tempList[i].itemList[j].expirationDate, tempList[i].itemList[j].amomount, tempList[i].name)
        newStorageArea.addNewItem(newItem, inventory1)
        newItem.display(newStorageArea, inventory1)
        }
    }
}

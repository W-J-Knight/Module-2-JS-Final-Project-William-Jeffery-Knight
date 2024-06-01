//Inventory class
class Inventory {
    // static storageAreaList = []
    constructor() {
        this.storageAreaList = []
        this.container = document.getElementById('container')
        this.createStorageArea = document.getElementById("storage-area-form")
        this.storageAreaNameInput = document.getElementById("storage-area-name")
        this.storageAreaTypeInput = document.getElementById("storage-area-type")
        this.itemSearchButton = document.getElementById('search-button')
        this.itemSearch = document.getElementById('search-item')
        this.searchItemClear = document.getElementById('clear-button')
        this.categorizingItem = document.getElementById('categories')
        this.categories = false

        // event listeners
        this.createStorageArea.addEventListener('submit', (e) => {
            e.preventDefault()

            const name = this.storageAreaNameInput.value
            const type = this.storageAreaTypeInput.value
            const newStorageArea = new StorageArea(name, type)
            this.addNewStorageArea(newStorageArea)
            newStorageArea.display(this)
        })
        this.itemSearchButton.addEventListener("click", (e) => {
            this.searchForItems()
        }
        )
        this.searchItemClear.addEventListener('click', (e) => {
            this.clearSearch()
        })

        this.categorizingItem.addEventListener('click', () => {
            this.toggleDisplays()
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


    // search for items
    searchForItems() {
        const searchText = this.itemSearch.value

        this.searchItemClear.style.display = 'block'
        this.storageAreaList.forEach((storageArea) => {
            console.log(storageArea.itemList)
        })

        let items
        this.categories ?
            items = document.querySelectorAll(".food-categories") :
            items = document.querySelectorAll(".food-item")
        items.forEach((item) => {
            const itemName = item.querySelector('.item-name').innerHTML.toLowerCase()
            console.log(itemName)
            if (itemName.indexOf(searchText) != -1) {
                item.style.display = 'flex'
                console.log('match')
            } else {
                item.style.display = 'none'
                console.log('not match')
            }
        })
    }
    
    clearSearch() {
        this.searchItemClear.style.display = 'none'
        this.itemSearch.value = ""
        const items = document.querySelectorAll(".food-item")
        items.forEach((item) => {
            item.style.display = 'flex'
        })
        
    }
    
    // toggle between displays
    toggleDisplays(){
        
        this.categories = !this.categories
        console.log(this.categories)
        
        if(this.categories) {
        const foodItemArray = document.querySelectorAll('.food-item')
        foodItemArray.forEach((foodItem) => {
            foodItem.style.display = "none"
        })

        this.storageAreaList.forEach((storageArea) => {
            let section = document.getElementById(`storage-area-${storageArea.storageAreaID}`)

            let categories = storageArea.sortIntoCategories()

            for (let categorie in categories) {
                const div = document.createElement('div')
                div.classList.add('food-categories')
                const h3 = document.createElement('h3')
                h3.classList.add('item-name')
                h3.appendChild(document.createTextNode(categorie.toLocaleUpperCase()))
                div.appendChild(h3)
                const itemNumber = document.createElement('h3')
                itemNumber.appendChild(document.createTextNode(`${categories[categorie].length} ITEMS`))
                div.appendChild(itemNumber)
                section.appendChild(div)
                this.categorizingItem.innerHTML = "Add or Remove Items"
            }
        })}else{
            const foodItemArray = document.querySelectorAll('.food-item')
            foodItemArray.forEach((foodItem) => {
                foodItem.style.display = "flex"
            })

            const foodCategoriesArray = document.querySelectorAll('.food-categories')
            foodCategoriesArray.forEach((categorie)=>{
                categorie.remove()
            })
            this.categorizingItem.innerHTML = "Categories"
        }
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
        }, [])

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
        button.addEventListener('click', () => {
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
                const loctionHref = location.href
                location.replace(loctionHref)//https://www.freecodecamp.org/news/javascript-refresh-page-how-to-reload-a-page-in-js/#:~:text=The%20simplest%20way%20to%20refresh,the%20location.reload()%20method.
                // location.reload(true)
                // newItem.display(this, inventory)
            }
        )
    }
    addNewItem(item, inventory) {
        this.itemList.push(item)
        this.sortedList()
        let storageArea_list = JSON.stringify(inventory.storageAreaList)
        localStorage.setItem("storageArea_list", storageArea_list)

    }

    deleteStorageArea(inventory, section) {
        inventory.storageAreaList = inventory.storageAreaList.filter((storageArea) => {
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
    display(storage, inventory) {

        const div = document.createElement('div')
        div.classList.add("food-item")
        div.setAttribute('id', `food-item${this.itemID}`)
        const p = document.createElement('p')
        p.classList.add('item-name')
        p.appendChild(document.createTextNode(this.name))
        const date = document.createElement("p")
        date.appendChild(document.createTextNode(this.expirationDate))
        div.appendChild(p)
        div.appendChild(date)
        const button = document.createElement("button")
        button.appendChild(document.createTextNode("remove item"))
        div.appendChild(button)
        button.addEventListener('click', () => {
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
        const filterArray = storage.itemList.filter((item) => {
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

let inventory1 = new Inventory()
// from local storage
if (localStorage.getItem("storageArea_list") == undefined) {
    console.log("No localStorage storageArea_list")
}
else {
    console.log('List')
    let tempList = JSON.parse(localStorage.getItem("storageArea_list"))
    for (i = 0; i < tempList.length; i++) {
        console.log(tempList[i])
        const newStorageArea = new StorageArea(tempList[i].name, tempList[i].type)
        inventory1.addNewStorageArea(newStorageArea)
        newStorageArea.display(inventory1)

        for (j = 0; j < tempList[i].itemList.length; j++) {
            let newItem = new Item(tempList[i].itemList[j].name, tempList[i].itemList[j].type, tempList[i].itemList[j].expirationDate, tempList[i].itemList[j].amomount, tempList[i].name)
            newStorageArea.addNewItem(newItem, inventory1)
            newItem.display(newStorageArea, inventory1)
        }
    }
}
// testing------------

// const inventory1 = new Inventory()
// function stringifyIn

// inventory1.searchForItems()

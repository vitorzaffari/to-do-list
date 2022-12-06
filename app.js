const addItemBtn = document.querySelector('.add-item')
const clearListBtn = document.querySelector('.clear-list')
const fullInputBox = document.querySelector('.new-item-input-box')
const smallInputBox = document.querySelector('.new-item-input');
const blurBkg = document.querySelector('.names-are-hard');
const confirmNewItem = document.querySelector('.btn-add');
const cancelNewItem = document.querySelector('.btn-cancel')
const inputNewItem = document.querySelector('.input-text');
const list = document.querySelector('#lists');
const info = document.querySelector('.info');
const infoTime = document.querySelector('.info-time');
const temp = document.querySelector('.temp');
const backgroundWeather = document.querySelector('.bkg-weather');
const weatherDescription = document.querySelector('.weather-info');
const displayIcon = document.querySelector('.display-icon');
//vars


const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];



function updateTime() {
    let date = new Date();
    let currentHour = date.getHours()
    let currentMinute = (("0" + date.getMinutes()).slice(-2));

    let currentWeekDay = date.getDay();
    let displayHour;
    let hourFormat = (currentHour > 12 ? "PM" : "AM");
    if (currentHour > 12) {
        displayHour = (currentHour - 12 + ':' + currentMinute + ' ' + hourFormat);
    } else {
        displayHour = (currentHour + ':' + currentMinute + ' ' + hourFormat);
    }

    let currentDate = weekDays[currentWeekDay] + ', ' + date.getDate()
    info.innerHTML = currentDate;


    infoTime.innerHTML = displayHour;
};

setInterval(updateTime, 1000);


let itemCounter = getLocalStorage()
let highestId = 0;
const key = "type key here";
const kelvin = 273;
const weatherInfo = {}

function getLocationInfo() {

    const success = (info) => {
        const latitude = info.coords.latitude;
        const longitude = info.coords.longitude;

        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`
        fetch(api)
            .then(res => res.json())
            .then(data => {
                temp.textContent = Math.floor(data.main.temp - kelvin) + ' °C';
                let weatherPhoto = data.weather[0].icon;
                let weatherDesc = data.weather[0].description
                backgroundWeather.innerHTML = `<img src="assets/${weatherPhoto}.jpg" alt="${weatherDesc}">`
                weatherDescription.textContent = weatherDesc;
                switch (weatherPhoto) {
                    case '04d':
                    case '04n':
                    case '03d':
                    case '03n':
                        displayIcon.textContent = 'cloud';
                        break;
                    case '01d':
                        displayIcon.textContent = 'sunny';
                        break;
                    case '01n':
                        displayIcon.textContent = 'clear_night';
                        break;
                    case '02d':
                        displayIcon.textContent = 'partly_cloudy_day';
                        break;
                    case '02n':
                        displayIcon.textContent = 'partly_cloudy_night';
                        break;
                    case '09d':
                    case '09n':
                    case '10d':
                    case '10n':
                        displayIcon.textContent = 'rainy';
                        break;
                    case '11d':
                    case '11n':
                        displayIcon.textContent = 'thunderstorm';
                        break;
                    case '13d':
                    case '13n':
                        displayIcon.textContent = 'weather_snowy';
                        break;
                    case '50d':
                    case '50n':
                        displayIcon.textContent = 'airware';
                }
            })
    }


    const error = (rdm) => {
        console.log("User didn't allow geolocation")
    }

    navigator.geolocation.getCurrentPosition(success, error);


}



window.addEventListener('DOMContentLoaded', createItensFromLocal);
window.addEventListener('DOMContentLoaded', getLocationInfo);

itemCounter.forEach(item => {
    item.id >= highestId ? highestId = (item.id + 1) : highestId;
})


addItemBtn.addEventListener('click', displayInputBox)
function displayInputBox() {

    inputNewItem.removeAttribute('disabled');
    document.addEventListener('keyup', (e) => {
        let pressedKey = e.key;
        if (pressedKey === "Escape") {
            cancelNewItemFunction();

        } else if (pressedKey === "Enter") {
            createNewItem();
        }
    })



    fullInputBox.style.scale = (1);
    blurBkg.style.filter = 'blur(2px)'
    blurBkg.style.transition = '300ms';
    fullInputBox.classList.add('fade');
    fullInputBox.style.transition = '300ms';
    inputNewItem.focus();
}

confirmNewItem.addEventListener('click', createNewItem);
function createNewItem() {



    let newItem = inputNewItem.value;

    if (newItem.trim().length === 0) {
        inputNewItem.focus();
    } else {
        fullInputBox.classList.remove('fade');
        const element = document.createElement('li');
        element.classList.add('item');
        // element.setAttribute('id')
        element.innerHTML = `<div class="group-items fade">
                            <input class='check' type="checkbox" />
                            <p>${newItem}</p>
                        </div>
                        <div class="menu-div" data>
                            <i class="fa-solid fa-bars menu"></i>
                        </div>
                        <div class="group-icons">
                                <i class="fa-regular fa-pen-to-square edit"></i>
                                <i class="fa-solid fa-trash trash"></i>
                        </div>
                        <div class="group-edit" data>
                                <i class="fa-solid fa-check confirm-edit"></i>
                                <i class="fa-solid fa-xmark cancel-edit"></i>
                        </div>`
        list.appendChild(element);
        inputNewItem.value = '';


        fullInputBox.style.transition = '300ms';
        fullInputBox.style.scale = (0);
        blurBkg.style.filter = 'blur(0)';
        blurBkg.style.transition = '1000ms';

        addToLocalStorage(highestId, newItem, "false");

        // add an unique ID to the new list item based on a counter, tried to do it with .childElementCount 
        //but it probably wouldn't work after the momment an Item was deleted, since it would assing a repeated 
        //number to the new element ID;

        highestId++;
        // console.log(counter);
        // let listItems = list.childElementCount;

        element.setAttribute('id', highestId);
        inputNewItem.setAttribute('disabled', '');
    }
}

cancelNewItem.addEventListener('click', cancelNewItemFunction);
function cancelNewItemFunction() {

    fullInputBox.style.scale = (0);
    fullInputBox.style.transition = '300ms';
    blurBkg.style.filter = 'none';
    blurBkg.style.transition = '800ms';
    inputNewItem.value = '';
    inputNewItem.setAttribute('disabled', '');
}

clearListBtn.addEventListener('click', clearList);
function clearList() {
    list.innerHTML = ''; // probably dont't need a function for this 
    localStorage.clear();
}
//finally it works
list.addEventListener('click', function (e) {


    if (e.target.classList.contains('menu')) {
        let listItem = e.target.parentElement.parentElement // specific li class=item, id=
        const groupIcons = listItem.querySelector('.group-icons')
        const thisGroupEdit = listItem.querySelector('.group-edit') //specific group edit

        let currentMenu = e.target.parentElement; // specific menu div 
        let allMenus = Array.from(listItem.parentElement.querySelectorAll('.menu-div')) //ul
        let allEditMenus = Array.from(listItem.parentElement.querySelectorAll('.group-edit'))

        // const isSelected = e.target.parentElement.parentElement.querySelector('.check').checked //checkbox

        if (currentMenu.hasAttribute('data')) {
            groupIcons.style.scale = (1);
            groupIcons.style.transition = '200ms';
            groupIcons.style.right = '10%'
            groupIcons.style.backgroundColor = 'rgba(124, 80, 138)';

            currentMenu.removeAttribute('data')

            e.target.style.transform = 'rotate(180deg)';
            e.target.style.transition = '500ms';

            allMenus.forEach(item => {
                if (!item.hasAttribute('data') && item !== currentMenu) {
                    item.setAttribute('data', '');
                    item.querySelector('.menu').style.transform = 'rotate(0)';
                    item.querySelector('.menu').style.transition = '500ms';
                    item.parentElement.querySelector('.group-icons').style.scale = (0);
                    item.parentElement.querySelector('.group-icons').style.transition = '200ms';
                    item.parentElement.querySelector('.group-icons').style.right = '0%';
                }
            });

            allEditMenus.forEach(item => {
                if (!item.hasAttribute('data')) {

                    let currentText = item.parentElement.querySelector('.group-items').querySelector('.input-edit').dataset.p;
                    item.setAttribute('data', '');
                    item.style.scale = (0);
                    item.style.transition = '200ms';



                    const currentMenu = item.parentElement.querySelector('.menu-div')
                    currentMenu.style.scale = (1);

                    const groupItems = item.parentElement.querySelector('.group-items');
                    groupItems.innerHTML =
                        `<div class="group-items fade">
                                <input class='check' type="checkbox" />
                                <p>${currentText}</p>
                            </div>`

                    if (groupItems.dataset.selected === 'true') {
                        groupItems.querySelector('.check').checked = true;
                        groupItems.querySelector('p').style.textDecoration = 'line-through';
                        groupItems.querySelector('p').style.color = 'lightgreen';
                        groupItems.dataset.selected = 'false';
                    }
                }
            })


        } else {
            groupIcons.style.scale = (0);
            groupIcons.style.transition = '200ms';
            groupIcons.style.right = '0%';
            currentMenu.setAttribute('data', '');
            e.target.style.transform = 'rotate(0)';
            e.target.style.transition = '500ms';
            // btn.style.color = '#fff';

        }
    }

    if (e.target.classList.contains('check')) {
        let strikeGreen = e.target.parentElement.querySelector('p');

        let thisItemId = e.target.parentElement.parentElement.id - 1
        let thisItemText = strikeGreen.innerHTML

        if (strikeGreen.parentElement.querySelector('.check').checked) {
            strikeGreen.style.textDecoration = 'line-through';
            strikeGreen.style.color = 'lightgreen';
            e.target.dataset.selected = true;
        } else {
            strikeGreen.style.textDecoration = 'blink';
            strikeGreen.style.color = 'white';
            e.target.dataset.selected = false;

        }

        editLocalStorage(thisItemId, thisItemText, (e.target.dataset.selected))

    }

    if (e.target.classList.contains('trash')) {
        let targetId = e.target.parentElement.parentElement.id;
        let itemsContainer = e.target.parentElement.parentElement.parentElement;
        let listItem = itemsContainer.querySelectorAll('.item')
        listItem.forEach(item => {
            if (item.id === targetId) {
                itemsContainer.removeChild(item);

                deleteFromLocal(targetId - 1);
                // highestId = highestId + 2;
            }
        })
    }

    if (e.target.classList.contains('edit')) {

        let targetId = e.target.parentElement.parentElement.id;
        let itemsContainer = e.target.parentElement.parentElement.parentElement;
        const listItem = itemsContainer.querySelectorAll('.item')
        const groupEdit = e.target.parentElement.parentElement.querySelector('.group-edit');
        groupEdit.removeAttribute('data');
        const groupIcons = e.target.parentElement.parentElement.querySelector('.group-icons');
        const menuDiv = e.target.parentElement.parentElement.querySelector('.menu-div');
        const isSelected = e.target.parentElement.parentElement.querySelector('.check').checked //checkbox





        listItem.forEach(item => {
            if (item.id === targetId) {

                const groupItems = item.querySelector('.group-items');
                const currentTextEl = groupItems.querySelector('p');
                const currentText = currentTextEl.innerHTML;


                item.addEventListener('keyup', (event) => {
                    let pressedKey = event.key;
                    if (pressedKey === "Escape") {
                        groupEdit.querySelector('.cancel-edit').click();
                    } else if (pressedKey === "Enter") {
                        groupEdit.querySelector('.confirm-edit').click();

                    }
                })


                groupEdit.style.scale = (1);
                groupEdit.style.transition = '300ms';
                groupIcons.style.scale = (0);
                groupIcons.style.transition = '300ms';
                menuDiv.style.scale = (0);
                menuDiv.style.transition = '300ms';

                groupItems.innerHTML =
                    `<i class="fa-regular fa-pen-to-square editing fade"></i>
                    <input type="text" class="input-edit fade" data-p="${currentText}">`

                const inputValue = groupItems.querySelector('.input-edit');
                inputValue.focus();
                ///////////
                if (isSelected) {
                    groupItems.dataset.selected = true;
                } else {
                    groupItems.dataset.selected = false;

                }



                item.addEventListener('click', (e) => {
                    if (e.target.classList.contains('confirm-edit')) {
                        groupEdit.setAttribute('data', '');

                        let thisId = e.target.parentElement.parentElement.id

                        let newText = inputValue.value;
                        if (newText.trim().length === 0) {
                            inputValue.focus();
                        }
                        else {

                            groupItems.innerHTML =
                                `<input class='check fade' type="checkbox" />
                            <p class='fade'>${newText}</p>`

                            if (groupItems.dataset.selected === 'true') {
                                groupItems.querySelector('.check').checked = true;
                                groupItems.querySelector('p').style.textDecoration = 'line-through';
                                groupItems.querySelector('p').style.color = 'lightgreen';

                            }

                            groupEdit.style.scale = (0);
                            groupEdit.style.transition = '300ms';
                            menuDiv.style.scale = (1);
                            menuDiv.setAttribute('data', '');
                            menuDiv.querySelector('.menu').style.transform = 'rotate(0)';
                        }
                        // groupItems.replaceChild(inputEdit, currentTextEl);

                        editLocalStorage((thisId - 1), newText, (groupItems.dataset.selected));

                    } else if (e.target.classList.contains('cancel-edit')) {
                        groupEdit.setAttribute('data', '');

                        function cancelEdit() {

                            groupItems.innerHTML =
                                `<div class="group-items fade">
                                            <input class='check' type="checkbox" />
                                            <p>${currentText}</p>
                                        </div>`

                            if (groupItems.dataset.selected === 'true') {
                                groupItems.querySelector('.check').checked = true;
                                groupItems.querySelector('p').style.textDecoration = 'line-through';
                                groupItems.querySelector('p').style.color = 'lightgreen';

                            }

                            groupEdit.style.scale = (0);
                            groupEdit.style.transition = '300ms';
                            menuDiv.style.scale = (1);
                            menuDiv.setAttribute('data', '');
                            menuDiv.querySelector('.menu').style.transform = 'rotate(0)';
                        }
                        cancelEdit();
                    }
                })

            }
        })

    }


})

function getLocalStorage() {
    return localStorage.getItem('itemList')
        ? JSON.parse(localStorage.getItem('itemList'))
        : [];
}

function addToLocalStorage(id, textValue, checkValue) {
    let itemInfo = { text: textValue, check: checkValue }
    const newItem = { id: id, value: itemInfo };
    let itens = getLocalStorage();
    itens.push(newItem);
    localStorage.setItem('itemList', JSON.stringify(itens));
}

function editLocalStorage(id, textValue, checkValue) {
    let itens = getLocalStorage();
    itens = itens.map(function (item) {
        if (item.id === id) {
            item.value.text = textValue;
            item.value.check = checkValue;
        }
        return item;
    });
    localStorage.setItem('itemList', JSON.stringify(itens));

}

function createItensFromLocal() {
    let itens = getLocalStorage();
    if (itens.length > 0) {
        itens.forEach(function (item) {
            setupItemFromLocal(item.id, item.value.text, item.value.check)
        });
    }
}
function setupItemFromLocal(id, textValue, checkValue) {
    const element = document.createElement('li');
    element.classList.add('item');
    element.innerHTML = `<div class="group-items">
                            <input class='check' type="checkbox" data-selected="${checkValue}"/>
                            <p>${textValue}</p>
                        </div>
                        <div class="menu-div" data>
                            <i class="fa-solid fa-bars menu"></i>
                        </div>
                        <div class="group-icons">
                                <i class="fa-regular fa-pen-to-square edit"></i>
                                <i class="fa-solid fa-trash trash"></i>
                        </div>
                        <div class="group-edit" data>
                                <i class="fa-solid fa-check confirm-edit"></i>
                                <i class="fa-solid fa-xmark cancel-edit"></i>
                        </div>`
    list.appendChild(element);
    element.setAttribute('id', (id + 1));


    if (element.querySelector('.check').dataset.selected === "true") {
        element.querySelector('.check').checked = true;
        element.querySelector('p').style.textDecoration = 'line-through';
        element.querySelector('p').style.color = 'lightgreen';
    }
}
function deleteFromLocal(id) {
    let itens = getLocalStorage();
    itens = itens.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem('itemList', JSON.stringify(itens));
}


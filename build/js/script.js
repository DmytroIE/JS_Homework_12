"use strict";

//*************************START PROCEDURE*************************/
var listOfURLs = [];
var listOfUUIDs = null; //localStorage.removeItem('listOfUUIDs');

if (storageAvailable('localStorage')) {
  listOfUUIDs = JSON.parse(localStorage.getItem('listOfUUIDs'));

  if (listOfUUIDs) {
    listOfUUIDs.forEach(function (item) {
      listOfURLs.push(JSON.parse(localStorage.getItem(item)));
    });
    localStorage.removeItem('listOfUUIDs'); // удаляем, чтобы пользователь вручную не стер этот объект из local storage
  } else {
    listOfUUIDs = [];
  }
}

renderList(); //*************************GET HTML-ELEMENTS********************/

var forms = {
  urlinfo: {
    form: document.querySelector('#urlinfo-form'),
    inputs: {
      input: document.querySelector('#urlinfo-form input[name="input"]')
    }
  }
}; //*********************************EVENTS*******************************/

function handleSubmit(evt) {
  evt.preventDefault();
  addSpinner();
  var requestString = forms.urlinfo.inputs.input.value.trim();
  getItem(requestString).then(function () {
    renderList();
    removeSpinner();
  }).catch(function (err) {
    console.log(err.message);
    removeSpinner();
    showErrModal(err.message);
  });
  this.reset();
}

forms.urlinfo.form.addEventListener('submit', handleSubmit);

function getItem() {
  var urlForRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://www.google.com';
  var accessKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5bb920a205cea06f38e7909709a72b521a4a9d1c05841';
  return window.fetch("http://api.linkpreview.net/?key=".concat(accessKey, "&q=").concat(urlForRequest)).then(function (response) {
    // console.log(response);
    if (response.ok) {
      return response.json();
    }

    throw new Error("".concat(response.statusText));
  }).then(function (data) {
    // console.log(data);
    var newItem = {};

    for (var key in data) {
      newItem[key] = data[key];
    }

    newItem.uuid = $.uuid();
    listOfUUIDs.unshift(newItem.uuid);
    listOfURLs.unshift(newItem);

    if (storageAvailable('localStorage')) {
      localStorage.setItem(newItem.uuid, JSON.stringify(newItem));
    }
  });
}

function handleDelete(target) {
  var uuidOfDelItem = target.parentElement.dataset.uuid;
  listOfURLs = listOfURLs.filter(function (item) {
    return item.uuid !== uuidOfDelItem;
  });
  listOfUUIDs = listOfUUIDs.filter(function (item) {
    return item !== uuidOfDelItem;
  });

  if (storageAvailable('localStorage')) {
    localStorage.removeItem(uuidOfDelItem);
  }

  renderList();
}

window.addEventListener('unload', function () {
  if (storageAvailable('localStorage')) {
    if (listOfUUIDs.length > 0) {
      localStorage.setItem('listOfUUIDs', JSON.stringify(listOfUUIDs)); // а теперь из оп. памяти записываем в local storage
    }
  }
});

function checkStorage() {
  //нужно,чтобы отслеживать, что кто-то вручную очистил хранилище
  if (storageAvailable('localStorage')) {
    var storageKeys = [];

    for (var i = 0; i < localStorage.length; i++) {
      storageKeys.push(localStorage.key(i));
    }

    listOfUUIDs = listOfUUIDs.filter(function (item) {
      return storageKeys.includes(item);
    });
  }
}

window.addEventListener('storage', checkStorage); //****************************RENDER*************************/

function renderList() {
  var markup = listOfURLs.reduce(function (acc, curr) {
    return acc + Handlebars.templates.ListItem(curr);
  }, '');
  document.getElementById('url-list').innerHTML = markup;
} //************************SPINNER******************************/


var spinner = document.getElementById('spinner');

function addSpinner() {
  spinner.classList.add("spinner--shown");
}

function removeSpinner() {
  spinner.classList.remove("spinner--shown");
} //**************************ERROR MODAL**************************/


var errModal = document.getElementById('err-modal');

function showErrModal(errMessage) {
  errModal.querySelector('.err-modal__text').textContent = 'Error: ' + errMessage;
  errModal.classList.remove('err-modal--hidden');
}

function hideErrModal() {
  errModal.classList.add('err-modal--hidden');
}

errModal.querySelector('.err-modal__cls-button').addEventListener('click', function (e) {
  e.preventDefault();
  hideErrModal();
}); //****************************LOCAL STORAGE *************************/

function storageAvailable(type) {
  try {
    var storage = window[type],
        x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && ( // everything except Firefox
    e.code === 22 || // Firefox
    e.code === 1014 || // test name field too, because code might not be present
    // everything except Firefox
    e.name === 'QuotaExceededError' || // Firefox
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
    storage.length !== 0;
  }
}
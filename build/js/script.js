"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//*************************START PROCEDURE*************************/
var listOfURLs = [];
var listOfUUIDs = []; //localStorage.removeItem('listOfUUIDs');
// работа с localStorage идет параллельно работе с основным массивом,
// чтобы, если localStorage недоступно, то работа всей остальной части программы
// оставалась без изменений

if (storageAvailable('localStorage')) {
  var localStorageRecord = localStorage.getItem('listOfUUIDs'); //

  if (localStorageRecord) {
    listOfUUIDs = JSON.parse(localStorageRecord);
    listOfUUIDs.forEach(function (item) {
      listOfURLs.push(JSON.parse(localStorage.getItem(item)));
    });
    localStorage.removeItem('listOfUUIDs'); // удаляем, чтобы пользователь вручную не стер этот объект из local storage
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
//*********SUBMIT**********/

function handleSubmit(evt) {
  evt.preventDefault();
  var URLChecker = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
  var requestString = forms.urlinfo.inputs.input.value.trim();

  if (!URLChecker.test(requestString)) {
    showErrModal('Invalid URL');
    return;
  }

  addSpinner();
  getItem(requestString).then(function () {
    renderList();
    removeSpinner();
  }).catch(function (err) {
    removeSpinner();
    showErrModal(handleHTTPRequestError(err));
  });
  this.reset();
}

forms.urlinfo.form.addEventListener('submit', handleSubmit);

function handleHTTPRequestError(err) {
  if (err.code) {
    switch (err.code) {
      case 424:
        return 'URL is not found or doesn\'t exist in the database';
        break;

      case 502:
        return 'Server error';
        break;

      default:
        return "Error with code ".concat(err.code, " has been occured");
    }
  }

  return "Error ".concat(err.message, " has been occured");
}

function getItem() {
  var urlForRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://www.google.com';
  var accessKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5bb920a205cea06f38e7909709a72b521a4a9d1c05841';
  return window.fetch("https://api.linkpreview.net/?key=".concat(accessKey, "&q=").concat(urlForRequest)).then(function (response) {
    console.log(response);

    if (response.ok) {
      return response.json();
    } else {
      var err = new Error();
      err.code = response.status;
      throw err;
    }
  }).then(function (data) {
    // добавляем, только если такой ссылки 
    // (именно такой, которую вернул API) еще нет в массиве ссылок 
    // (и, соответственно, в localStorage)
    //debugger
    var UUIDsPlacedIntoList = listOfURLs.map(function (item) {
      return item.url;
    });

    if (!UUIDsPlacedIntoList.includes(data.url)) {
      var newItem = _objectSpread({}, data); //for (let key in data) {
      //  newItem[key] = data[key];
      // }


      newItem.uuid = $.uuid();
      listOfURLs.unshift(newItem);

      if (storageAvailable('localStorage')) {
        listOfUUIDs.unshift(newItem.uuid);
        localStorage.setItem(newItem.uuid, JSON.stringify(newItem));
      }
    } else {
      showErrModal('URL is already in the list');
    }
  });
} //*********DELETE**********/


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
} //*********UNLOAD**********/


window.addEventListener('unload', function () {
  if (storageAvailable('localStorage')) {
    if (listOfUUIDs.length > 0) {
      localStorage.setItem('listOfUUIDs', JSON.stringify(listOfUUIDs)); // а теперь из оп. памяти записываем в local storage
    }
  }
});

function checkStorage() {
  //нужно,чтобы отслеживать, что кто-то вручную очистил хранилище
  var storageKeys = [];

  for (var i = 0; i < localStorage.length; i++) {
    storageKeys.push(localStorage.key(i));
  }

  listOfUUIDs = listOfUUIDs.filter(function (item) {
    return storageKeys.includes(item);
  });
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
  errModal.querySelector('.err-modal__text').textContent = 'Ups: ' + errMessage;
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
    console.log('check storage');
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
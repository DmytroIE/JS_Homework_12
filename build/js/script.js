"use strict";

var listOfURLs = [];
var forms = {
  urlinfo: {
    form: document.querySelector('#urlinfo-form'),
    inputs: {
      input: document.querySelector('#urlinfo-form input[name="input"]')
    }
  }
};

function handleSubmit(e) {
  e.preventDefault();
  addSpinner();
  var requestString = forms.urlinfo.inputs.input.value.trim(); // console.log(requestString);

  getItem(requestString).then(function () {
    renderList();
    removeSpinner();
  }).catch(function (err) {
    removeSpinner();
    showErrModal(err.message);
  });
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
    listOfURLs.unshift(newItem); //console.log(listOfURLs);
    //renderList();

    return;
  }); //.catch(err => {console.log('Error is:' + err.message);})
}

function handleDelete(target) {
  var uuidOfDelItem = target.parentElement.dataset.uuid;
  listOfURLs = listOfURLs.filter(function (item) {
    return item.uuid !== uuidOfDelItem;
  });
  renderList();
}

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

function showErrModal(err) {
  errModal.querySelector('.err-modal__text').textContent = 'Error: ' + err.message;
  errModal.classList.remove('err-modal--hidden');
}

function hideErrModal() {
  errModal.classList.add('err-modal--hidden');
}

errModal.querySelector('.err-modal__cls-button').addEventListener('click', function (e) {
  e.preventDefault();
  hideErrModal();
});
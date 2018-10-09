
//*************************START PROCEDURE*************************/

let listOfURLs = [];
let listOfUUIDs = null;
//localStorage.removeItem('listOfUUIDs');



if (storageAvailable('localStorage')) {
  listOfUUIDs = JSON.parse(localStorage.getItem('listOfUUIDs'));
  if (listOfUUIDs) {
    listOfUUIDs.forEach(item => {
      listOfURLs.push(JSON.parse(localStorage.getItem(item)));
    });
    localStorage.removeItem('listOfUUIDs'); // удаляем, чтобы пользователь вручную не стер этот объект из local storage
  } else {
    listOfUUIDs = [];
  }
  
}

renderList();



//*************************GET HTML-ELEMENTS********************/
const forms = {

  urlinfo: {
    form: document.querySelector('#urlinfo-form'), 
    inputs: {
      input: document.querySelector('#urlinfo-form input[name="input"]'),
    },
  },
};



//*********************************EVENTS*******************************/
function handleSubmit(evt) {
  evt.preventDefault();
  addSpinner();

  const requestString = forms.urlinfo.inputs.input.value.trim();

  getItem(requestString)
  .then(() => {
    renderList();
    removeSpinner();
  })
  .catch(err => {console.log(err.message); removeSpinner(); showErrModal(err.message);});
  
  this.reset();
}
forms.urlinfo.form.addEventListener('submit', handleSubmit)

function getItem(urlForRequest = 'https://www.google.com', accessKey = '5bb920a205cea06f38e7909709a72b521a4a9d1c05841') {
  return window.fetch(`http://api.linkpreview.net/?key=${accessKey}&q=${urlForRequest}`)
    .then(response => {
      // console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.statusText}`);
    })
    .then(data => {
      // console.log(data);
      const newItem = {};
      for (let key in data) {
        newItem[key] = data[key];
      }
      newItem.uuid = $.uuid();

      listOfUUIDs.unshift(newItem.uuid);
      listOfURLs.unshift(newItem);

      if (storageAvailable('localStorage')) {
        localStorage.setItem(newItem.uuid, JSON.stringify(newItem));
      }
    })

}

function handleDelete(target) {
  const uuidOfDelItem = target.parentElement.dataset.uuid;

  listOfURLs = listOfURLs.filter(item=>item.uuid!==uuidOfDelItem);

  listOfUUIDs = listOfUUIDs.filter(item=>item!==uuidOfDelItem);

  if (storageAvailable('localStorage')) {
    localStorage.removeItem(uuidOfDelItem);
  }
  renderList();

}

window.addEventListener('unload', () =>{

  if (storageAvailable('localStorage')) {
    if (listOfUUIDs.length > 0) {
      localStorage.setItem('listOfUUIDs', JSON.stringify(listOfUUIDs)); // а теперь из оп. памяти записываем в local storage
    }
  }
});

function checkStorage() { //нужно,чтобы отслеживать, что кто-то вручную очистил хранилище

  if (storageAvailable('localStorage')) {
    const storageKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      storageKeys.push(localStorage.key(i));
    }
    listOfUUIDs = listOfUUIDs.filter(item => storageKeys.includes(item));
  }
}
window.addEventListener('storage', checkStorage);


//****************************RENDER*************************/


function renderList() {

  const markup = listOfURLs.reduce( (acc, curr) => acc + Handlebars.templates.ListItem(curr),'')

  document.getElementById('url-list').innerHTML = markup;

}

//************************SPINNER******************************/
const spinner = document.getElementById('spinner');

function addSpinner() {
  spinner.classList.add("spinner--shown");
}

function removeSpinner() {
  spinner.classList.remove("spinner--shown");
}

//**************************ERROR MODAL**************************/
const errModal = document.getElementById('err-modal');

function showErrModal(errMessage) {
  errModal.querySelector('.err-modal__text').textContent = 'Error: ' + errMessage;
  errModal.classList.remove('err-modal--hidden');
}

function hideErrModal() {
  errModal.classList.add('err-modal--hidden');
}

errModal.querySelector('.err-modal__cls-button').addEventListener('click', (e) => {
  e.preventDefault();
  hideErrModal();
} )

//****************************LOCAL STORAGE *************************/

function storageAvailable(type) {
  try {
      var storage = window[type],
          x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0;
  }
}


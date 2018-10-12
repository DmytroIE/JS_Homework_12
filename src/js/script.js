const KEY_PREFIX = 'URLapp';


//*************************START PROCEDURE*************************/

let listOfURLs = [];
let theLargestIndexOfLinks = 0;

// работа с localStorage идет параллельно работе с основным массивом,
// чтобы, если localStorage недоступно, то работа всей остальной части программы
// оставалась без изменений

if (storageAvailable('localStorage')) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes(KEY_PREFIX)) {
      const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      listOfURLs.push(item);
      theLargestIndexOfLinks = Math.max(theLargestIndexOfLinks, item.index);
    }
  }
}

// локальное хранилище произвольно меняет индексы записей, потому
// после перезагрузки порядок отображения ссылок может наружаться
// потому какждой ссылке присваивается индекс, и по нему идет сортировка перед отображением

listOfURLs.sort((a, b) => b.index-a.index);

if (listOfURLs.length  >0) {
  renderList();
} else {
  createDefaulText();
}

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

    //*********SUBMIT**********/
function handleSubmit(evt) {
  evt.preventDefault();
  const URLChecker=/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
  const requestString = forms.urlinfo.inputs.input.value.trim();
  if (!URLChecker.test(requestString)) {
    showErrModal('Invalid URL');
    return;
  }
  addSpinner();

  getItem(requestString)
  .then(() => {
    renderList();
    removeSpinner();
  })
  .catch(err => {removeSpinner(); showErrModal(handleHTTPRequestError(err));});
  
  this.reset();
}
forms.urlinfo.form.addEventListener('submit', handleSubmit)

function handleHTTPRequestError(err) {
  if (err.code) {
    switch (err.code) {
      case 424: return 'URL is not found or doesn\'t exist in the database'; break;
      case 429: return 'Too many requests'; break;
      case 502: return 'Server error';break;
      default: return `Error with code ${err.code} has been occured`;
    } 
  }
  return `Error ${err.message} has been occured`
}

function getItem(urlForRequest = 'https://www.google.com', accessKey = '5bb920a205cea06f38e7909709a72b521a4a9d1c05841') {
  return window.fetch(`https://api.linkpreview.net/?key=${accessKey}&q=${urlForRequest}`)
    .then(response => {
      //console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        const err = new Error();
        err.code = response.status;
        throw err;
      }
      
    })
    .then(data => {

      // добавляем, только если такой ссылки 
      // (именно такой, которую вернул API) еще нет в массиве ссылок 
      // (и, соответственно, в localStorage)
      //debugger
      const UUIDsPlacedIntoList = listOfURLs.map(item => item.url);
      if (!UUIDsPlacedIntoList.includes(data.url)){
        const newItem = {...data};
        newItem.uuid = KEY_PREFIX + $.uuid();
        theLargestIndexOfLinks += 1;
        newItem.index = theLargestIndexOfLinks;
        listOfURLs.unshift(newItem);

        if (storageAvailable('localStorage')) {
          localStorage.setItem(newItem.uuid, JSON.stringify(newItem));
        }
      } else {
        showErrModal('URL is already in the list');
      }
    })

}

    //*********DELETE**********/

function handleDelete(target) {
  const uuidOfDelItem = target.parentElement.dataset.uuid;

  listOfURLs = listOfURLs.filter(item=>item.uuid!==uuidOfDelItem);

  if (storageAvailable('localStorage')) {
    localStorage.removeItem(uuidOfDelItem);
  }

  if (listOfURLs.length  > 0) {
    renderList();
  } else {
    createDefaulText();
  }
}

//****************************RENDER*************************/

function renderList() {

  const markup = listOfURLs.reduce( (acc, curr) => acc + Handlebars.templates.ListItem(curr),'')
  document.getElementById('url-list').innerHTML = markup;

}

function createDefaulText() {
  document.getElementById('url-list').innerHTML = '<li class="urlinfo__default-text">Your bookmarks will be added here...</li>';
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
  errModal.querySelector('.err-modal__text').textContent = errMessage;
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
      //console.log('check storage');
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


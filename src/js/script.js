
let listOfURLs = [];

const forms = {

  urlinfo: {
    form: document.querySelector('#urlinfo-form'), 
    inputs: {
      input: document.querySelector('#urlinfo-form input[name="input"]'),
    },
  },
};

function handleSubmit(e) {
  e.preventDefault();
  addSpinner();

  const requestString = forms.urlinfo.inputs.input.value.trim();
  // console.log(requestString);
  getItem(requestString)
  .then(() => {
    renderList();
    removeSpinner();
  })
  .catch(err => {removeSpinner(); showErrModal(err.message);})
  ;

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

      listOfURLs.unshift(newItem);
      //console.log(listOfURLs);
      //renderList();
      return;
    })
    //.catch(err => {console.log('Error is:' + err.message);})
}

function handleDelete(target) {
  const uuidOfDelItem = target.parentElement.dataset.uuid;
  listOfURLs = listOfURLs.filter(item=>item.uuid!==uuidOfDelItem);
  renderList();

}



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

function showErrModal(err) {
  errModal.querySelector('.err-modal__text').textContent = 'Error: ' + err.message;
  errModal.classList.remove('err-modal--hidden');
}

function hideErrModal() {
  errModal.classList.add('err-modal--hidden');
}

errModal.querySelector('.err-modal__cls-button').addEventListener('click', (e) => {
  e.preventDefault();
  hideErrModal();
} )
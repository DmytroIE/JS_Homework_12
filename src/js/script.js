const key = '5bb920a205cea06f38e7909709a72b521a4a9d1c05841';


function getData(urlForRequest = 'https://www.google.com') {

  return window.fetch(`http://api.linkpreview.net/?key=${key}&q=${urlForRequest}`)
    .then(response => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.statusText}`);
    })
    .then(data => {
      //if (data.status === 200 || data.status === 201){
        console.log(data);
      //}
      //throw new Error(`${data.status}: ${data.errors}:((((`);
    })
    .catch(err => {console.log('Error:' + err);})
}

getData('https://developer.mozilla.org/ru/');
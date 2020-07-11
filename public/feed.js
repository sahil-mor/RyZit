var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form')
var titleInput = document.querySelector('#title')
var locationInput = document.querySelector('#location')

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
  // if('serviceWorker' in navigator){
  //   navigator.serviceWorker.getRegistrations()
  //   .then( registrations => {
  //     for(var i = 0 ; i < registrations.length; i++){
  //       console.log(registrations)
  //       registrations[i].unregister();
  //     }
  //   } )
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
// function onSaveButtonClicked(event) {
//   console.log('clicked');
//   if ('caches' in window) {
//     caches.open('user-requested')
//       .then(function(cache) {
//         cache.add('https://httpbin.org/get');
//         cache.add('/src/images/sf-boat.jpg');
//       });
//   }
// }

function clearCard(){
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data){
  for(var i = 0 ; i < data.length; i++){
    createCard(data[i])
  }
}

var url = "https://pwagram-8e88f.firebaseio.com/posts.json";
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log("from web")
    networkDataReceived = true;
    var dataArr = []
    for(var key in data){
      dataArr.push(data[key])
    }
    clearCard();
    updateUI(dataArr)
  });


if ('indexedDB' in window) {
  readAllData('posts')
  .then( data => {
    if(!networkDataReceived){
      console.log("from db",data)
      updateUI(data)
    }
  } )
}

sentData = () => {
  fetch('https://pwagram-8e88f.firebaseio.com/posts.json',{
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    },
    body : JSON.stringify({
      id : new Date().toISOString(),
      title : titleInput.value,
      location : locationInput.value,
      image : "https://firebasestorage.googleapis.com/v0/b/instaclone-e5e91.appspot.com/o/ProfileImages%2FSahil--M14QqK1B7G90n6aAeDj%2F55f8480b-ea3d-461c-94d3-ec1bced95e49.jpg?alt=media&token=69fd7dce-e32c-4c30-b148-2f7931e85e59",  
    }),
   
  })
  .then( res => {
    console.log('sent data')
    updateUI();
  })
}

form.addEventListener('submit', event => {
  event.preventDefault();

  if(titleInput.value.trim() === '' || locationInput.value.trim() === '' ){
    alert("Please enter valid data")
    return;
  }

  closeCreatePostModal();

  //register sync task

  if('serviceWorker' in navigator && 'SyncManager' in window ){
    navigator.serviceWorker.ready
    .then( sw => {
      var post = {
        title : titleInput.value,
        location : locationInput.value,
        id : new Date().toISOString(),
      }
      writeData('sync-posts',post)
      .then( () => {
        return sw.sync.register('sync-new-post');
      } )
      .then( () => { //front end
        // var snackbarContainer = document.querySelector('#confirmation-toast');
        // var data = { message : 'Your post was saved fro syncing' }
        // snackbarContainer.MaterialSnackbar.showSnackBar(data);
        console.log("done here")
      })
      .catch( err => {
        console.log(err)
      } )
    } )

  }else{
    sentData(); // if SW  is not supported
  }

})
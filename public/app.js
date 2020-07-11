
if( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('/sw.js')
}

if (!window.Promise) {
    window.Promise = Promise;
  }

var enableNotification = document.querySelector("#notification")


displayConfirmNotification = () => {
    if('serviceWorker' in navigator ){
      var options = {
        body : 'You have successfully subscribed to our notifications.',
        icon : './icons/96x96.png',
        dir : 'ltr',
        lang : 'en-US' ,//BCP 47
        vibrate : [100,50,200],
        badge : './icons/96x96.png',
        tag : 'confirm-notification', //same ones are show only once
        renotify : true, // same tag will vibrate
        actions : [
          {
            action : 'confirm', title : "Okay", icon : "./icons/96x96.png"
          }
        ]
      }
      navigator.serviceWorker.ready
      .then( swreg => {
        swreg.showNotification('Successfully Subscribed',options)
      })
    }else{
    //   console.log("no service worker")
    }
  }
  
configurePushSub = () => {
    if(!('serviceWorker' in navigator)){
        return; //no push withour sw
    }
    var reg ;

    navigator.serviceWorker.ready
    .then( swreg => {
        reg = swreg;
        return swreg.pushManager.getSubscription()
    } )
    .then( sub => {
        if(sub === null){
        //new sub
        var vapidPublicKey = "BODNo79y6EjFqHCpKPh-auheD4NH21jWIhaDZt7_uBt9LLg4ZVUJ-8rfMRg47VZWVviLA-pC_awr71lvnt705vs"
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey)
        return reg.pushManager.subscribe({
            userVisibleOnly : true,
            applicationServerKey : convertedVapidPublicKey,
        })
        }
    } )
    .then( newSub => {
        return fetch('/newSubscription',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
        },
        body : JSON.stringify(newSub)
        })
    } )
    .then( res => {
        if(res.ok){
            enableNotification.style.display = 'none'
            displayConfirmNotification()
        }else{
          alert("Some error occured ... Try Again")
        }
    } )
    .catch(err => {
        console.log(err)
    })
}

  askForNotificationPermission = () => {
    Notification.requestPermission( (result) => {
        console.log('user choice ',result)
        if(result !== 'granted'){
            console.log("no notification permission granted!!!")
        }else{
            //Hide button
            configurePushSub()
        }
    } )
  }
  
  if( 'Notification' in window && 'serviceWorker' in navigator ){
      if(enableNotification != null)
        enableNotification.addEventListener('click',askForNotificationPermission)
  }
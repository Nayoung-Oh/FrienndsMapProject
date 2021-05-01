$( document ).ready(function() {
  var config = {
    apiKey: "AIzaSyB6Gr9XAiOl0-5_DPEO2K6C6GGf1T5exOc",
    authDomain: "friendsmapproject-8e1b0.firebaseapp.com",
    projectId: "friendsmapproject-8e1b0",
    storageBucket: "friendsmapproject-8e1b0.appspot.com",
    messagingSenderId: "429230676810",
    appId: "1:429230676810:web:ea6f78ce375c8cf29e3fb3"
  };
  firebase.initializeApp(config);
  var db = firebase.firestore();
  var university = document.getElementById("university");
  var send = document.getElementById("send");
  var cancel = document.getElementById("cancel");
  var content = document.getElementById("content");
  var copy = document.getElementById("copy");  
  var url = "tmp";
  var urlData = [];
  var currentid = 0;
  var sentence = "친구 지도 프로젝트 (By KAIST 전산학부 오나영) 참여에 초대합니다. 자세한 설명은 아래 링크를 클릭하시면 확인하실 수 있습니다."
  cancel.disabled = true;
  function bindEvents(){
    university.addEventListener("keyup", (event) => {
      if(event.keyCode === 13){
        send.click();
      }
    });
    
    send.onclick = function(){
      if (university.value !== ""){
        db.collection("Log").add({
          prev: urlData["prev"],
          university: university.value
        })
        .then((docRef) => 
        {
          university.value = "";
          $("#university").autocomplete("destroy"); 
          cancel.disabled = false;
          send.disabled = true;
          currentid = docRef.id;
          showContents(currentid);
          setAuto();
        })
      }
    }

    cancel.onclick = function(){
      send.disabled = false;
      cancel.disabled = true;
      db.collection("Log").doc(currentid).delete();
      content.value = "";
    }

    copy.onclick = function(){
      content.select();
      content.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }
    
  }

  function setAuto(){
    $("#university").autocomplete({
      source: univList,
      minLength: 2,
      delay: 0,
      select: function(event, ui){
        university.value = ui.item.value;
        send.click();
        $(this).val('');
        return false;
      }
    });
  }
  function showContents(id){
    url+= ("?prev="+id)
    content.value = sentence + url;
  }
  function getURLParams(url) {
    var result = {};
    url.replace(/[?&]{1}([^=&#]+)=([^&#]*)/g, function(s, k, v) { result[k] = decodeURIComponent(v); });
    return result;
  }//https://jsikim1.tistory.com/112 (by 김씩씩) 
  function init(){
    urlData = getURLParams(location.search);
    setAuto();
  }
  init();
  bindEvents();
});

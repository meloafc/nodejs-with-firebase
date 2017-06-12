const firebase = require("firebase");
const moment = require("moment");
const firebaseConfig = require("./config/firebaseConfig.json").config;

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

//ativarLog(firebase);
//quantidadeDeEventos();
lerEvento("01/06/2017","13/06/2017");


function lerEvento(inicio, fim) {
  let inicioUnix = getUnixTimestamp(inicio);
  let fimUnix = getUnixTimestamp(fim);

  let telaLigada = 0;

  let ref = db.ref("events/active_screen");
  ref.orderByChild("initialDate")
    .startAt(inicioUnix)
    .endAt(fimUnix)
    .once("value", function(snapshot) {
      snapshot.forEach(function(childSnap){
        let event = childSnap.val();

        let log = moment(event.initialDate).format("DD/MM/YYYY HH:mm:ss.SSS");
        log = log + " duração:" + formatarMilisegundos(event.duration);

        telaLigada = telaLigada + event.duration;

        console.log(log);
      });
  }).then(function(result) {
    console.log(formatarMilisegundos(telaLigada));
  });  
}

function quantidadeDeEventos() {
  let ref = db.ref("events/active_screen");

  ref.once('value', function(snapshot) {
    console.log(snapshot.numChildren());
  });
}

function ativarLog(firebase) {
  firebase.database.enableLogging(true);
}

function getUnixTimestamp(data) {
  return moment(data,"DD/MM/YYYY").valueOf();
}

function formatarMilisegundos(duration) {
  var milliseconds = parseInt((duration%1000)/100)
    , seconds = parseInt((duration/1000)%60)
    , minutes = parseInt((duration/(1000*60))%60)
    , hours = parseInt((duration/(1000*60*60)));

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
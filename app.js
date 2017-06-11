const firebase = require("firebase");
const moment = require("moment");
const firebaseConfig = require("./config/firebaseConfig.json").config;

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

//ativarLog(firebase);
lerEvento("01/06/2017","12/06/2017");


function lerEvento(inicio, fim) {
  let inicioUnix = getUnixTimestamp(inicio);
  let fimUnix = getUnixTimestamp(fim);

  let telaLigada = 0;
  let ultimoEvento;

  let ref = db.ref("events");
  ref.orderByChild("date")
    .startAt(inicioUnix)
    .endAt(fimUnix)
    .once("value", function(snapshot) {
      snapshot.forEach(function(childSnap){
        let event = childSnap.val();

        let log = event.type;
        log = log + " - " + moment(event.date).format("DD/MM/YYYY HH:mm:ss.SSS");
        
        if(ultimoEvento != undefined) {
          if(ultimoEvento.type == 'ACTION_SCREEN_ON') {
            if(ultimoEvento.date < event.date) {
              let tempoTelaLigada = event.date - ultimoEvento.date;
              telaLigada = telaLigada + tempoTelaLigada;
              log = log + " duração:" + formatarMilisegundos(tempoTelaLigada);
            }
          }
        }

        console.log(log);
        ultimoEvento = event;
      });
  }).then(function(result) {
    console.log(formatarMilisegundos(telaLigada));
  });  
}

function lerTodosOsEventos() {
  let ref = db.ref("events");

  ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnap){
        console.log(childSnap.val());
      });
  });
}

function quantidadeDeEventos() {
  let ref = db.ref("events");

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
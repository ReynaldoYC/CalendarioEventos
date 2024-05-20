import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "./firebase.js";

const myModal = new bootstrap.Modal(document.getElementById("myModal"));
let formulario = document.getElementById("formulario");
let request_calendar = "events.json";

document.addEventListener("DOMContentLoaded", async function () {
  var calendar = document.getElementById("calendar");
  const querySnapshot = await getDocs(collection(db,'Eventos'));
  const data = querySnapshot.docs;  

  const datadb = [];
        data.forEach( doc => {
          const evento = doc.data();
          datadb.push(evento);
        })

  var calendar = new FullCalendar.Calendar(calendar, {
    initialView: "dayGridMonth",
    locale: "es",
    allDaySlot: false,
    slotMinTime: '06:00:00',
    slotMaxTime: '25:00:00',
    headerToolbar: {
      left: "prev, today, next",
      center: "title",
      right: "dayGridMonth, timeGridWeek, timeGridDay, listWeek",
    },
    dateClick: function (info) {
      console.log(info.dateStr);
      document.getElementById("start").value = info.dateStr;
      document.getElementById("titulo").textContent = "Registrar Evento";
      myModal.show();
    },
    events: datadb
   /* 
    title: event.eventTitle,
    start: new Date(event.eventStartDate),
    end: new Date(event.eventEndDate),
    url: event.eventUrl,
    location: event.eventLocation,
    timeStart: event.eventStartTime,
    timeEnd: event.eventEndTime
    */ 
  });
  calendar.render();
  
});

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const fecha = document.getElementById("start").value;
  const color = document.getElementById("color").value;
  if (title == "" || fecha == "" || color == "") {
    console.log("Todos los datos son obligatarios");
  } else {
    addEvent(title, fecha, color);
  }
});

async function addEvent(title, fecha, color) {
  try {
    const evento = {
      title: title,
      fecha: fecha,
      color: color,
    };
    const response = await insert(evento);
  } catch (error) {
    console.log(error);
  }
} 

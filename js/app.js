import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
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
    initialView: "timeGridWeek",
    locale: "es",
    allDaySlot: false,
    slotMinTime: '06:00:00',
    slotMaxTime: '25:00:00',
    slotLabelFormat: { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    },
    dayHeaderFormat: { 
      weekday: 'long', 
      day: 'numeric' 
    },
    views: {
      timeGridWeek: {
        titleFormat: { month: 'long' }
      },
      dayGridMonth: {
        titleFormat: { month: 'long' }
      },
      timeGridDay: {
        titleFormat: { month: 'long' }
      },
      listWeek: {
        titleFormat: { day: 'numeric', month: 'long', omitCommas: true } // Muestra el rango de fechas con el mes completo, sin el año
      }
    },
    headerToolbar: {
      left: "prev, today, next",
      center: "title",
      right: "dayGridMonth, timeGridWeek, timeGridDay, listWeek",
    },
    dateClick: function (info) {
      console.log(info.dateStr);
      const fechaAdd = info.dateStr;
      document.getElementById("start").value = info.dateStr;
      document.getElementById("titulo").textContent = "Registrar Evento";
      myModal.show();
    },
    /* events: datadb */
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
          const querySnapshot = await getDocs(collection(db, 'Eventos'));
          const events = querySnapshot.docs.map(doc => {
              const eventData = doc.data();
              return {
                  title: eventData.title,
                  start: eventData.start,
                  end: eventData.end
              };
          });
          successCallback(events);
      } catch (error) {
          console.error('Error getting events: ', error);
          failureCallback(error);
      }
  },
  eventClick: function(info) {
      // Lógica para manejar el clic en un evento
      console.log(info.event.title);
  }
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
/* window.agregarEvento = async function() {
    const title = document.getElementById('eventTitle').value;
    const start = new Date(document.getElementById('eventStart').value);
    const end = new Date(document.getElementById('eventEnd').value);
    
    try {
        const docRef = await addDoc(collection(db, 'events'), {
            title: title,
            start: Timestamp.fromDate(start),
            end: Timestamp.fromDate(end)
        });
        console.log('Evento agregado con ID: ', docRef.id);
        
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventStart').value = '';
        document.getElementById('eventEnd').value = '';
    } catch (error) {
        console.error('Error adding event: ', error);
    }
} */
async function addEvent(title, fecha, color) {
  console.log(title,fecha,color);
  try {
    const docRef = await addDoc(collection(db, 'Eventos'), {
        title: title,
        start: fecha,
        color: color
    });
    console.log('Evento agregado con ID: ', docRef.id);
    
    document.getElementById("title").value = '';
document.getElementById("start").value = '';
document.getElementById("color").value= '';

} catch (error) {
    console.error('Error adding event: ', error);
}
} 

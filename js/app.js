import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, getFirestore, doc, collection, setDoc, addDoc, updateDoc, deleteDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "./firebase.js";



const myModal = new bootstrap.Modal(document.getElementById("myModal"));
let formulario = document.getElementById("formulario");
const alertDiv = document.getElementById('alert');

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    locale: "es",
    allDaySlot: false,
    slotMinTime: '06:00:00',
    slotMaxTime: '25:00:00',
    height: '100%',
    slotLabelFormat: { 
      hour: 'numeric', 
      hour12: true 
    },
    slotLabelClassNames: {
      hour: 'custom-hour-class'
    },
    dayHeaderFormat: { 
      weekday: 'long'
    },
    views: {
      timeGridWeek: {
        titleFormat: { month: 'long', day: 'numeric' },
        dayHeaderFormat: { weekday: 'long', day: 'numeric' }
      },
      dayGridMonth: {
        titleFormat: { month: 'long' }
      },
      timeGridDay: {
        titleFormat: { month: 'long' },
        dayHeaderFormat: { weekday: 'long', day: 'numeric' }
      },
      listWeek: {
        titleFormat: { day: 'numeric', month: 'long', omitCommas: true } 
      }
    },
    buttonText: {
      today:    'HOY',
      month:    'MES',
      week:     'SEMANA',
      day:      'DÍA',
      list:     'LISTA'
    },
    headerToolbar: {
      left: "prev,today,next",
      center: "",
      right: "title",
    },
    customButtons: {
      titleButton: {
        text: 'title',
        click: function() {
          // Empty function as a placeholder
        }
      }
    },
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
          const querySnapshot = await getDocs(collection(db, 'Eventos'));
          const events = querySnapshot.docs.map(doc => {
              const eventData = doc.data();
              return {
                id: doc.id,
                title: eventData.title,
                start: eventData.start,
                color: eventData.color
              };
          });
          successCallback(events);
      } catch (error) {
          console.error('Error getting events: ', error);
          failureCallback(error);
      }
    },
    dateClick: function (info) {
      resetModal();
      const fechaAdd = info.dateStr;
      const fechaHora = info.date;
      const fechaHoraLocal = fechaHora.toISOString().slice(10, 16);
      document.getElementById("start").value = fechaAdd.length <= 10 ? fechaAdd+fechaHoraLocal : fechaAdd.slice(0, 16);
      document.getElementById("titulo").textContent = "Registrar Evento";
      document.getElementById("btnUpdate").style.display = "none";
      document.getElementById("btnDelete").style.display = "none";
      myModal.show();
    },
    eventClick: function(info) {
      const event = info.event;
      resetModal(); 
      document.getElementById('id').value = event.id;
      document.getElementById("title").value = event.title;
      document.getElementById("start").value = event.startStr.slice(0,16);
      document.getElementById("color").value = event.backgroundColor;
      document.getElementById("titulo").textContent = "Editar Evento";
      document.getElementById("btnAction").style.display = "none";
      document.getElementById("btnUpdate").style.display = "inline-block";  
      document.getElementById("btnDelete").style.display = "inline-block";
      myModal.show();
    }
  });

  calendar.render();
  // Set the initial title
  const viewButtons = document.querySelectorAll('.btn-group button');

viewButtons.forEach(button => {
  button.addEventListener('click', function (event) {
    const viewName = event.target.getAttribute('data-view');
    calendar.changeView(viewName);
  });
  const calendarTitleEl = document.getElementById('calendar-title'); // Suponiendo que tienes un elemento con ID "calendarTitle"

calendar.on('datesSet', function () {
  const viewTitle = calendar.view.title;
  calendarTitleEl.textContent = viewTitle;
});

});
  document.querySelector('.dropdown-menu').addEventListener('click', function (e) {
    if (e.target.matches('.dropdown-item')) {
      e.preventDefault();
      const view = e.target.getAttribute('data-view');
      calendar.changeView(view);
    }
  });
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const fecha = document.getElementById("start").value;
    const color = document.getElementById("color").value;
    
    if (!title || !fecha || !color ) {
      alertDiv.textContent = "Por favor, complete todos los campos.";
      alertDiv.style.display = "block";
      return;
    } 
    alertDiv.style.display = "none";
    // creamos un id 
    const eventId = generateUniqueId();
    try {
      addEventDB(eventId, title, fecha, color, calendar);
      formulario.reset();
      myModal.hide();
    } catch (error) {
      console.error('Error agregando evento', error);
    }
  });
  document.getElementById("btnUpdate").addEventListener('click', function(){
    const id = document.getElementById('id').value;
    const title = document.getElementById("title").value;
    const fecha = document.getElementById("start").value;
    const color = document.getElementById("color").value;
    updateEventDB(id, title, fecha, color, calendar);
    myModal.hide();
  });
  document.getElementById("btnDelete").addEventListener('click', function(){
    const id = document.getElementById('id').value;
    deleteEventDB(id, calendar);
    myModal.hide();
  });
});

function generateUniqueId() {
  return new Date().getTime().toString() + '_' + Math.random().toString(36).substring(2, 15);
}

async function addEventDB(id, title, fecha, color, calendar) {
  try {
    const docRef = await setDoc(doc(db, 'Eventos', id), {
        title: title,
        start: fecha,
        color: color
    });
    
    console.log('Evento agregado con ID: ', id);
    calendar.addEvent({
      id: id,
      title: title,
      start: fecha,
      color: color
    });
  } catch (error) {
    console.error('Error adding event: ', error);
  }
}
async function updateEventDB(id, title, fecha, color, calendar){
  try {
    console.log(id);
    await updateDoc(doc(db, 'Eventos', id), {
      title: title,
      start: fecha,
      color: color
    });
    
    const event = calendar.getEventById(id);
    if(event){
      event.setProp('title', title);
      event.setStart(fecha);
      event.setProp('color', color);
    }
  } catch (error) {
    console.log("Error actualizando evento: ", error);
  }
}
async function deleteEventDB(id, calendar){
  try {
    await deleteDoc(doc(db,"Eventos", id));
    console.log("Evento eliminado con ID: ", id);

    const event = calendar.getEventById(id);
    if(event){
      event.remove();
    } else {
      console.warn("el evento no existe en el calenjdario");
    }
  } catch (error) {
    console.error("Error eliminando evento: ", error);
  }
}

function resetModal() {
  document.getElementById("formulario").reset();
  document.getElementById('id').value = '';
  document.getElementById("alert").style.display = "none";
  document.getElementById("btnAction").style.display = "inline-block";
  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("btnDelete").style.display = "none";
}
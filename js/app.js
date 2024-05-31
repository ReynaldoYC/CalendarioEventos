import { onAuthStateChanged, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence  } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
  getDocs,
  getFirestore,
  doc,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";


// login 
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Local persistence successfully set");
  })
  .catch((error) => {
    console.error("Error setting local persistence: ", error);
  });

// Selecciona los elementos del DOM
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const appContainer = document.getElementById('app-contenido');
const loginContainer = document.getElementById('login-container');

// Escucha el evento de submit del formulario de inicio de sesión
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginContainer.style.display = 'none';
      appContainer.style.display = 'block';
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
  } else {
    loginContainer.style.display = 'block';
    appContainer.style.display = 'none';
  }
});

document.getElementById('logout').addEventListener('click', () => {
  auth.signOut();
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}






const myModal = new bootstrap.Modal(document.getElementById("myModal"));
let formulario = document.getElementById("formulario");
const alertDiv = document.getElementById("alert");
const isMobile = window.innerWidth <= 768;
document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    locale: "es",
    allDaySlot: false,
    slotMinTime: "06:00:00",
    slotMaxTime: "25:00:00",
    height: "100%",
    slotLabelFormat: {
      hour: "numeric",
      hour12: true,
    },
    slotLabelClassNames: {
      hour: "custom-hour-class",
    },
    dayHeaderFormat: isMobile
      ? { weekday: "narrow", day: "numeric" }
      : { weekday: "long", day: "numeric" },
    views: {
      timeGridWeek: {
        titleFormat: { month: "long", day: "numeric" },
        dayHeaderFormat: isMobile
          ? { weekday: "narrow", day: "numeric" }
          : { weekday: "long", day: "numeric" },
      },
      dayGridMonth: {
        titleFormat: { month: "long" },
        dayHeaderFormat: isMobile ? { weekday: "short" } : { weekday: "long" },
      },
      timeGridDay: {
        titleFormat: { month: "long" },
        dayHeaderFormat: { weekday: "long", day: "numeric" },
      },
      listWeek: {
        titleFormat: { day: "numeric", month: "long", omitCommas: true },
      },
    },
    headerToolbar: {
      left: "prev,today,next",
      center: "",
      right: "title",
    },
    customButtons: {
      titleButton: {
        text: "title",
        click: function () {},
      },
    },
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const querySnapshot = await getDocs(collection(db, "Eventos"));
        const events = querySnapshot.docs.map((doc) => {
          const eventData = doc.data();

          return {
            id: doc.id,
            title: eventData.title,
            start: eventData.start,
            contractor: eventData.contractor,
            dni: eventData.dni,
            timeContracted: eventData.timeContracted,
            address: eventData.address,
            mobility: eventData.mobility,
            members: eventData.members,
            totalAmount: eventData.totalAmount,
            amountPaid: eventData.amountPaid,
            remainingAmount: eventData.remainingAmount,
            remark: eventData.remark,
            dateReg: eventData.dateReg
          };
        });
        console.log('hola mundo');
        successCallback(events);
      } catch (error) {
        console.error("Error getting events: ", error);
        failureCallback(error);
      }
    },
    dateClick: function (info) {
      resetModal();
      const fechaAdd = info.dateStr;
      const fechaHora = info.date;
      const fechaHoraLocal = fechaHora.toISOString().slice(10, 16);
      document.getElementById("start").value =
        fechaAdd.length <= 10
          ? fechaAdd + fechaHoraLocal
          : fechaAdd.slice(0, 16);
      document.getElementById("titulo").textContent = "Registrar Evento";
      document.getElementById("btnUpdate").style.display = "none";
      document.getElementById("btnDelete").style.display = "none";
      myModal.show();
    },
    eventClick: function (info) {
      const event = info.event;
      resetModal();
      document.getElementById("id").value = event.id;
      document.getElementById("dateReg").value = event.extendedProps.dateReg;
      document.getElementById("title").value = event.title;
      document.getElementById("contractor").value =
        event.extendedProps.contractor;
      document.getElementById("dni").value = event.extendedProps.dni;
      document.getElementById("start").value = event.startStr.slice(0, 16);
      document.getElementById("timeContracted").value =
        event.extendedProps.timeContracted;
      document.getElementById("address").value = event.extendedProps.address;
      document.getElementById("mobility").value = event.extendedProps.mobility;
      document.getElementById("members").value = event.extendedProps.members;
      document.getElementById("totalAmount").value =
        event.extendedProps.totalAmount;
      document.getElementById("amountPaid").value =
        event.extendedProps.amountPaid;
      document.getElementById("remainingAmount").value =
        event.extendedProps.remainingAmount;
      document.getElementById("remark").value = event.extendedProps.remark;

      document.getElementById("titulo").textContent = "Editar Evento";
      document.getElementById("btnAction").style.display = "none";
      document.getElementById("btnUpdate").style.display = "inline-block";
      document.getElementById("btnDelete").style.display = "inline-block";
      myModal.show();
    },
  });

  calendar.render();

  const viewButtons = document.querySelectorAll(".btn-group button");
  viewButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const viewName = event.target.getAttribute("data-view");
      calendar.changeView(viewName);
    });
    const calendarTitleEl = document.getElementById("calendar-title");
    calendar.on("datesSet", function () {
      const viewTitle = calendar.view.title;
      calendarTitleEl.textContent = viewTitle;
    });
  });
  document
    .querySelector(".dropdown-menu")
    .addEventListener("click", function (e) {
      if (e.target.matches(".dropdown-item")) {
        e.preventDefault();
        const view = e.target.getAttribute("data-view");
        calendar.changeView(view);
      }
    });
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const contractor = document.getElementById("contractor").value;
    const dni = document.getElementById("dni").value;
    const fecha = document.getElementById("start").value;
    const timeContracted = document.getElementById("timeContracted").value;
    const address = document.getElementById("address").value;
    const mobility = document.getElementById("mobility").value;
    const members = document.getElementById("members").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const amountPaid = document.getElementById("amountPaid").value;
    const remainingAmount = document.getElementById("remainingAmount").value;
    const remark = document.getElementById("remark").value;

    if (
      !title ||
      !contractor ||
      !dni ||
      !fecha ||
      !timeContracted ||
      !address ||
      !mobility ||
      !members ||
      !totalAmount ||
      !amountPaid ||
      !remainingAmount
    ) {
      alertDiv.textContent = "Por favor, complete todos los campos.";
      alertDiv.style.display = "block";
      return;
    }
    alertDiv.style.display = "none";
    const eventId = generateUniqueId();
    const dateReg = registrationDate();
    try {
      addEventDB(
        eventId,
        title,
        contractor,
        dni,
        fecha,
        timeContracted,
        address,
        mobility,
        members,
        totalAmount,
        amountPaid,
        remainingAmount,
        remark,
        calendar,
        dateReg
      );
      formulario.reset();
      myModal.hide();
    } catch (error) {
      console.error("Error agregando evento", error);
    }
  });
  document.getElementById("btnUpdate").addEventListener("click", function () {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const contractor = document.getElementById("contractor").value;
    const dni = document.getElementById("dni").value;
    const fecha = document.getElementById("start").value;
    const timeContracted = document.getElementById("timeContracted").value;
    const address = document.getElementById("address").value;
    const mobility = document.getElementById("mobility").value;
    const members = document.getElementById("members").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const amountPaid = document.getElementById("amountPaid").value;
    const remainingAmount = document.getElementById("remainingAmount").value;
    const remark = document.getElementById("remark").value;
    if (
      !title ||
      !contractor ||
      !dni ||
      !fecha ||
      !timeContracted ||
      !address ||
      !mobility ||
      !members ||
      !totalAmount ||
      !amountPaid ||
      !remainingAmount
    ) {
      alertDiv.textContent = "Por favor, complete todos los campos.";
      alertDiv.style.display = "block";
      return;
    }
    updateEventDB(
      id,
      title,
      contractor,
      dni,
      fecha,
      timeContracted,
      address,
      mobility,
      members,
      totalAmount,
      amountPaid,
      remainingAmount,
      remark,
      calendar
    );
    myModal.hide();
  });
  document.getElementById("btnDelete").addEventListener("click", function () {
    const id = document.getElementById("id").value;
    deleteEventDB(id, calendar);
    myModal.hide();
  });
});

function generateUniqueId() {
  return (
    new Date().getTime().toString() +
    "_" +
    Math.random().toString(36).substring(2, 15)
  );
}
async function addEventDB(
  id,
  title,
  contractor,
  dni,
  fecha,
  timeContracted,
  address,
  mobility,
  members,
  totalAmount,
  amountPaid,
  remainingAmount,
  remark,
  calendar,
  dateReg
) {
  try {
    const docRef = await setDoc(doc(db, "Eventos", id), {
      title: title,
      contractor: contractor,
      dni: dni,
      start: fecha,
      timeContracted: timeContracted,
      address: address,
      mobility: mobility,
      members: members,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      remainingAmount: remainingAmount,
      remark: remark,
      dateReg: dateReg,
    });

    console.log("Evento agregado con ID: ", id);
    calendar.addEvent({
      id: id,
      title: title,
      contractor: contractor,
      dni: dni,
      start: fecha,
      timeContracted: timeContracted,
      address: address,
      mobility: mobility,
      members: members,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      remainingAmount: remainingAmount,
      remark: remark,
      dateReg: dateReg,
    });
  } catch (error) {
    console.error("Error adding event: ", error);
  }
}
async function updateEventDB(
  id,
  title,
  contractor,
  dni,
  fecha,
  timeContracted,
  address,
  mobility,
  members,
  totalAmount,
  amountPaid,
  remainingAmount,
  remark,
  calendar
) {
  try {
    await updateDoc(doc(db, "Eventos", id), {
      title: title,
      contractor: contractor,
      dni: dni,
      start: fecha,
      timeContracted: timeContracted,
      address: address,
      mobility: mobility,
      members: members,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      remainingAmount: remainingAmount,
      remark: remark,
    });

    const event = calendar.getEventById(id);
    if (event) {
      event.setProp("title", title);
      event.setStart(fecha);
      event.setExtendedProp("contractor", contractor);
      event.setExtendedProp("dni", dni);
      event.setExtendedProp("timeContracted", timeContracted);
      event.setExtendedProp("address", address);
      event.setExtendedProp("mobility", mobility);
      event.setExtendedProp("members", members);
      event.setExtendedProp("totalAmount", totalAmount);
      event.setExtendedProp("amountPaid", amountPaid);
      event.setExtendedProp("remainingAmount", remainingAmount);
      event.setExtendedProp("remark", remark);
    }
  } catch (error) {
    console.log("Error actualizando evento: ", error);
  }
}
async function deleteEventDB(id, calendar) {
  try {
    await deleteDoc(doc(db, "Eventos", id));
    console.log("Evento eliminado con ID: ", id);

    const event = calendar.getEventById(id);
    if (event) {
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
  document.getElementById("id").value = "";
  document.getElementById("alert").style.display = "none";
  document.getElementById("btnAction").style.display = "inline-block";
  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("btnDelete").style.display = "none";
}

document.getElementById("totalAmount").addEventListener("keyup", () => {
  const total = document.getElementById("totalAmount").value;
  let acuenta = document.getElementById("amountPaid").value;
  const saldo = document.getElementById("remainingAmount");
  if (total) {
    saldo.value = total - acuenta;
  }
});
document.getElementById("amountPaid").addEventListener("keyup", () => {
  const total = document.getElementById("totalAmount").value;
  let acuenta = document.getElementById("amountPaid").value;
  const saldo = document.getElementById("remainingAmount");
  if (total) {
    saldo.value = total - acuenta;
  }
});
function registrationDate() {
  const fechaActual = new Date();
  const dia = String(fechaActual.getDate()).padStart(2, "0");
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const año = fechaActual.getFullYear();
  const fechaFormateada = `${dia}-${mes}-${año}`;
  return fechaFormateada;
}


document.getElementById("btnInvoice").addEventListener("click", function () {
  const id = document.getElementById("id").value;
  const dateReg = document.getElementById("dateReg").value;
  const title = document.getElementById("title").value;
  const contractor = document.getElementById("contractor").value;
  const dni = document.getElementById("dni").value;
  const fecha = document.getElementById("start").value;
  const timeContracted = document.getElementById("timeContracted").value;
  const address = document.getElementById("address").value;
  const mobility = document.getElementById("mobility").value;
  const totalAmount = document.getElementById("totalAmount").value;
  const amountPaid = document.getElementById("amountPaid").value;
  const remainingAmount = document.getElementById("remainingAmount").value;
  const remark = document.getElementById("remark").value;
  if (
    !title ||
    !contractor ||
    !dni ||
    !fecha ||
    !timeContracted ||
    !address ||
    !mobility ||
    !members ||
    !totalAmount ||
    !amountPaid ||
    !remainingAmount
  ) {
    alertDiv.textContent = "Por favor, complete todos los campos.";
    alertDiv.style.display = "block";
    return;
  }
  generatePNG(id, dateReg, title, contractor, dni, fecha, timeContracted, address, mobility, totalAmount, amountPaid, remainingAmount, remark);
  // myModal.hide();
});

function generatePNG(id, dateReg, title, contractor, dni, fecha, timeContracted, address, mobility, totalAmount, amountPaid, remainingAmount, remark) {
  document.getElementById("invoiceTitle").textContent = title;
  document.getElementById("invoiceId").textContent = id;
  document.getElementById("invoiceContractor").textContent = contractor;
  //document.getElementById("invoiceDNI").textContent = dni;
  document.getElementById("invoiceDate").textContent = formatearFecha(fecha.slice(0,10));
  document.getElementById("invoiceDay").textContent = dateReg.slice(0, 2);
  document.getElementById("invoiceMonth").textContent = dateReg.slice(3,5);
  document.getElementById("invoiceYear").textContent = dateReg.slice(6,10);
  document.getElementById("invoiceTimeContracted").textContent = formatearHoraContratada(timeContracted);
  document.getElementById("invoiceAddress").textContent = address;
  document.getElementById("invoiceHour").textContent = formatearHora(fecha.slice(11,16));
  document.getElementById("invoiceMobility").textContent = mobility;
  document.getElementById("invoiceTotalAmount").textContent = totalAmount;
  document.getElementById("invoiceAmountPaid").textContent = amountPaid;
  document.getElementById("invoiceRemainingAmount").textContent = remainingAmount;
  document.getElementById("invoiceRemark").textContent = remark;
  function formatearHoraContratada(timeContracted){
    const partes = timeContracted.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const segundos = parseInt(partes[2], 10);

    if (horas > 0) {
        return `${horas} hora y ${minutos} minutos`;
    } else if (minutos > 0) {
        return segundos > 0 ? `${minutos} minutos ${segundos} s` : `${minutos} minutos`;
    } else {
        return `${segundos} s`;
    }
  }
  function formatearFecha(fecha){
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  const partes = fecha.split('-');
  
 
  const año = partes[0];
  const mes = parseInt(partes[1], 10) - 1; // Restar 1 porque los meses en el array empiezan desde 0
  const día = parseInt(partes[2], 10);
  
  // Formatear la fecha
  return `${día} de ${meses[mes]} del ${año}`;
  }
  function formatearHora(hora) {
    // Dividir la hora en horas y minutos
    const partes = hora.split(':');
    
    // Extraer horas y minutos
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    
    // Verificar el caso especial de 24:00
    if (horas === 24 && minutos === '00') {
        return `12:00 am`;
    }
    
    // Determinar AM o PM
    const periodo = horas >= 12 ? 'pm' : 'am';
    
    // Convertir horas al formato de 12 horas
    horas = horas % 12 || 12; // Convertir 0 a 12 para el formato 12 horas
    
    // Formatear la hora
    return `${horas}:${minutos} ${periodo}`;
}
  document.getElementById("invoice").style.display = "block";
  html2canvas(document.getElementById("invoice")).then(canvas => {
    const imgData = canvas.toDataURL("image/png")
    // Ocultar la boleta nuevamente
    document.getElementById("invoice").style.display = "none"
    // Crear un enlace de descarga para la imagen
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'boleta.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
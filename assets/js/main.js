let geocoder;
let circle;


function initMap() {
    const ubicacion = { lat: -34.737194, lng: -58.4400156 };

    const mapa = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: ubicacion,
        disableDefaultUI: true,
    });

    geocoder = new google.maps.Geocoder();

    // Crear el círculo de rango
    circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mapa,
        center: ubicacion,
        radius: 3000,
    });

    document.getElementById("home-service").addEventListener("change", function () {
        const directionGroup = document.getElementById("content-direction");
        if (this.checked) {
            directionGroup.classList.add("show");
        } else {
            directionGroup.classList.remove("show");
        }
    });
}

function verificarDireccion(direction, local, callback) {
    geocoder.geocode({ address: direction }, (results, status) => {
        if (status === "OK") {
            const ubicacionPedido = results[0].geometry.location;

            // Accede a latitud y longitud correctamente
            const latitud = ubicacionPedido.lat();
            const longitud = ubicacionPedido.lng();

            const estaDentroDelRango = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(local.lat, local.lng), // Usa las coordenadas correctas
                ubicacionPedido
            );

            if (estaDentroDelRango) {
                callback(true); // Llama al callback con true si está dentro del rango
            } else {
                console.log("La dirección está fuera del rango.");
                alert("La dirección está fuera del rango. No se puede enviar el mensaje.");
                callback(false); // Llama al callback con false si está fuera del rango
            }
        } else {
            console.log("No verifica.");
            alert("No se pudo verificar la dirección. Por favor, verifica que la dirección sea válida.");
            callback(false); // Llama al callback con false si la dirección no es válida
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Obtener la fecha actual
  const today = new Date();

  // Formatear la fecha en formato YYYY-MM-DD
  const formattedDate = today.toISOString().split('T')[0];

  // Establecer la fecha mínima en el input de fecha
  document.getElementById("date").setAttribute("min", formattedDate);
});

document.getElementById("send-wsp").addEventListener("click", function () {
    const date = document.getElementById("date").value;

    const serviceElement = document.querySelector('input[name="engine"]:checked');
    const service = serviceElement ? serviceElement.parentNode.querySelector('.radio-label').innerText : null;
    const homeService = document.querySelector('.container-check input').checked;
    const address = document.getElementById("direction").value;

    if (!date || !service) {
        alert("Por favor completa la fecha y selecciona un servicio.");
        return;
    }

    // Si el servicio es a domicilio, verificar la dirección
    if (homeService && !address.trim()) {
        alert("Por favor, indica una dirección para el servicio a domicilio.");
        return;
    }

    // Deshabilitar el botón mientras se verifica la dirección si es necesario
    this.disabled = true;

    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}`;

    // Verificar solo si el servicio es a domicilio
    if (homeService) {
        verificarDireccion(address, { lat: -34.7408519, lng: -58.4426624 }, (isValid) => {
            if (isValid) {
                let message = `Hola, quiero agendar un turno el ${formattedDate} para el servicio de: ${service}.`;
                message += ` Servicio a domicilio en: ${address}.`;

                const whatsappURL = `https://wa.me/+541161248952?text=${encodeURIComponent(message)}`;
                window.open(whatsappURL, "_blank");
            } else {
                this.disabled = false; // Habilitar el botón nuevamente si la dirección no es válida
            }
        });
    } else {
        // Si no es servicio a domicilio, solo enviar el mensaje
        let message = `Hola, quiero agendar un turno el ${formattedDate} para el servicio de: ${service}.`;

        const whatsappURL = `https://wa.me/+541161248952?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
    }
});



document.getElementById("start").addEventListener("click", function () {
  const buttonStart = document.getElementById("start-container");
  const globalStart = document.getElementById("global");      
  
  buttonStart.style.display = "none"; 

  globalStart.classList.remove("hidden");
  globalStart.classList.add("visible");
});





import { region_comuna } from './region_comuna.js';

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById('formulario');
    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', handleFormSubmit);

    const regionInput = document.getElementById("region");
    if (regionInput) regionInput.addEventListener("change", handleRegionChange);
    
    const terminoInput = document.getElementById('termino');
    if (terminoInput) terminoInput.addEventListener('input', handleTerminoInput);
    
    const dropdownButton = document.querySelector('.dropdown-button');
    if (dropdownButton) dropdownButton.addEventListener('click', toggleDropdownMenu);
    
    const otroCheckbox = document.querySelector('#dropdown-menu input[value="otro"]');
    if (otroCheckbox) otroCheckbox.addEventListener('change', sincronizarOtroTema); 

    const selectContacto = document.getElementById('contactar-por');
    if (selectContacto) selectContacto.addEventListener('change', handleAgregarContacto);

    const agregarFotoButton = document.getElementById('agregar-foto');
    if (agregarFotoButton) agregarFotoButton.addEventListener('click', agregarFoto);

  
    
    let contadorFotos = document.querySelectorAll('#fotos-container .foto-wrapper').length;
    
    inicializarRegiones(regionInput);
    inicializarFechaInicio();

 
    sincronizarOtroTema();

    function handleFormSubmit(event) {
        event.preventDefault();
        const errorMessages = validarFormulario();
        if (errorMessages !== "") {
            alert(errorMessages);
        } else {
            if (confirm("¿Está seguro que desea agregar esta actividad?")) {
                formulario.submit();
            }
        }
    }
    
    function handleRegionChange() {
        const selectedRegion = regionInput.value;
        const comunaInput = document.getElementById("comuna");
        comunaInput.innerHTML = '<option value="">-- Seleccione comuna --</option>';
        if (selectedRegion && selectedRegion !== "sin-region") {
            const region = region_comuna.regiones.find((r) => r.nombre === selectedRegion);
            if (region) {
                region.comunas.forEach((comuna) => {
                    const option = document.createElement("option");
                    option.value = comuna.nombre;
                    option.text = comuna.nombre;
                    comunaInput.appendChild(option);
                });
            }
        }
    }
    
    function handleTerminoInput() {
        const inicioInput = document.getElementById('inicio');
        const terminoInput = document.getElementById('termino');
        if (terminoInput.value && new Date(terminoInput.value) <= new Date(inicioInput.value)) {
            alert('La fecha de término debe ser mayor a la de inicio.');
            terminoInput.value = '';
        }
    }
    
    function toggleDropdownMenu() {
        const dropdownMenu = document.getElementById('dropdown-menu');
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    }

    
    function sincronizarOtroTema() {
        const otroCheckbox = document.querySelector('#dropdown-menu input[value="otro"]');
        const otroTemaDiv = document.getElementById('otro-tema');
        // aseguramos de q los elementos existan antes de manipularlos
        if (otroCheckbox && otroTemaDiv) {
            otroTemaDiv.style.display = otroCheckbox.checked ? 'block' : 'none';
        }
    }
    
    function handleAgregarContacto() {
        const inputsContainer = document.getElementById('inputs-contacto');
        const medioSeleccionado = this.value;

        if (!medioSeleccionado) return;

        if (inputsContainer.childElementCount >= 5) {
            alert('Puedes agregar un máximo de 5 medios de contacto.');
        } else if (inputsContainer.querySelector(`[data-medio="${medioSeleccionado}"]`)) {
            alert(`Ya has agregado un campo para ${medioSeleccionado}.`);
        } else {
            crearInputContacto(medioSeleccionado, inputsContainer);
        }
        
        this.value = '';
    }

   

    function validarFormulario() {
  
    const regionInput = document.getElementById("region");
    const comunaInput = document.getElementById("comuna"); 
    const sectorInput = document.getElementById("sector");

 
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    const inputsContacto = document.getElementById('inputs-contacto').querySelectorAll('.contacto-input-wrapper'); 
 
    const inicioInput = document.getElementById('inicio');
    const terminoInput = document.getElementById('termino');
    const descripcionInput = document.getElementById('descripcion');
    
    
    const temasCheckboxes = document.querySelectorAll('#dropdown-menu input[type="checkbox"]:checked:not([value="otro"])');
    const otroCheckbox = document.querySelector('#dropdown-menu input[value="otro"]');
    const otroTemaInput = document.getElementById('otro-tema-input'); 
  
    const fotosInputs = document.querySelectorAll('#fotos-container input[type="file"]');

   
    let msg = "";

    if (regionInput.value === "" || regionInput.value === "sin-region") {
        msg += "Por favor, seleccione la región.\n";
    }

    
    if (regionInput.value !== "" && regionInput.value !== "sin-region" && (comunaInput.value === "" || comunaInput.value === "sin-comuna")) {
        msg += "Por favor, seleccione la comuna.\n";
    }

    if (sectorInput.value.length > 100) {
        msg += "El sector no puede tener más de 100 caracteres.\n";
    }

   
    if (nombreInput.value.trim() === "") {
        msg += "Por favor, ingrese su nombre.\n";
    }
    if (nombreInput.value.length > 200) {
        msg += "El nombre no puede tener más de 200 caracteres.\n";
    }

    if (emailInput.value.trim() === "") {
        msg += "Por favor, ingrese su email.\n";
    } else {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        if (!emailRegex.test(emailInput.value)) {
            msg += "Dirección de correo electrónico inválida.\n";
        }
    }

    if (emailInput.value.length > 100) {
        msg += "El email no puede tener más de 100 caracteres.\n";
    }

    if (telefonoInput.value.trim() !== "") {
        if (!/^(\+56\d{9}|\d{9})$/.test(telefonoInput.value)) {
            msg += "El formato del teléfono es incorrecto (ej: +56912345678 o 912345678).\n";
        }
    }

    inputsContacto.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        const valor = input.value.trim();
        const medio = wrapper.dataset.medio;
        if (valor.length > 0 && (valor.length < 4 || valor.length > 50)) {
            msg += `El campo de contacto "${medio}" debe tener entre 4 y 50 caracteres (o déjelo vacío).\n`;
        }
    });

    
    const inicioFecha = new Date(inicioInput.value);

    if (inicioInput.value.trim() === "" || isNaN(inicioFecha.getTime())) {
        msg += "Por favor, seleccione una fecha y hora de inicio válida.\n";
    }

    if (terminoInput.value.trim() !== "") {
        const terminoFecha = new Date(terminoInput.value);
        if (isNaN(terminoFecha.getTime())) {
            msg += "La fecha y hora de término no es válida.\n";
        } else if (inicioFecha >= terminoFecha) {
            msg += "La fecha de término debe ser posterior a la fecha de inicio.\n";
        }
    }

    if (descripcionInput.value.length > 500) {
        msg += "La descripción no puede tener más de 500 caracteres.\n";
    }
    let temaOtroValido = false;
    if (otroCheckbox && otroCheckbox.checked) {
        const otroTemaValor = otroTemaInput.value.trim();
        if (otroTemaValor.length < 3 || otroTemaValor.length > 15) {
            msg += "El tema 'Otro' debe tener entre 3 y 15 caracteres.\n";
        } else {
            temaOtroValido = true;
        }
    }

    if (temasCheckboxes.length === 0 && !temaOtroValido) {
        msg += "Debe seleccionar al menos un tema o especificar uno válido en 'Otro'.\n";
    }

 
    if (fotosInputs.length === 0) {
        msg += "Debe agregar al menos una imagen.\n";
    } else if (fotosInputs.length > 5) {
        msg += "No puede agregar más de 5 imágenes.\n";
    } else {
        const formatosValidos = ['image/jpeg', 'image/png', 'image/gif'];
        let primeraFotoValidada = false;
        fotosInputs.forEach((fotoInput, index) => {
      
            if (index === 0 && fotoInput.files.length === 0) {
                primeraFotoValidada = false;
            } else if (index === 0) {
                primeraFotoValidada = true;
            }

            if (fotoInput.files.length > 0) {
                const file = fotoInput.files[0];
                if (!formatosValidos.includes(file.type)) {
                    msg += `El archivo ${file.name} tiene un formato no válido. Solo se permiten JPEG, PNG o GIF.\n`;
                }
            }
        });
        
        if (!primeraFotoValidada && fotosInputs.length > 0) {
             msg += "La primera foto es obligatoria.\n";
        }
    }

    return msg;
}

    function crearInputContacto(medio, container) {
        const divWrapper = document.createElement('div');
        divWrapper.className = 'contacto-input-wrapper';
        divWrapper.dataset.medio = medio;
        divWrapper.innerHTML = `
            <label>${medio.charAt(0).toUpperCase() + medio.slice(1)}:</label>
            <input type="text" name="${medio}" placeholder="Tu usuario/ID de ${medio}">
            <button type="button" class="eliminar-btn">X</button>
        `;
        container.appendChild(divWrapper);
        divWrapper.querySelector('.eliminar-btn').addEventListener('click', () => divWrapper.remove());
    }

    function agregarFoto() {
        if (contadorFotos < 5) {
            crearInputFoto();
            contadorFotos++; 
        } else {
            alert('Solo puedes agregar hasta 5 fotos.');
        }
    }

    function crearInputFoto() {
        const fotosContainer = document.getElementById('fotos-container');
        const nuevaFotoWrapper = document.createElement('div');
        nuevaFotoWrapper.className = 'foto-wrapper';
        nuevaFotoWrapper.innerHTML = `
            <input type="file" name="fotos[]" accept="image/jpeg, image/png, image/gif" ${contadorFotos === 0 ? 'required' : ''}>
            <button type="button" class="eliminar-btn">Eliminar</button>
        `;
        fotosContainer.appendChild(nuevaFotoWrapper);
        nuevaFotoWrapper.querySelector('.eliminar-btn').addEventListener('click', () => {
            nuevaFotoWrapper.remove();
            contadorFotos--;
        });
    }
    
    function inicializarRegiones(regionSelect) {
        if (regionSelect && regionSelect.options.length <= 1) {
             region_comuna.regiones.forEach((region) => {
                const option = document.createElement("option");
                option.value = region.nombre;
                option.text = region.nombre;
                regionSelect.appendChild(option);
            });
        }
    }
    
    function inicializarFechaInicio() {
        const inicioInput = document.getElementById('inicio');
        if (inicioInput && !inicioInput.value) { 
            const now = new Date();
            const offset = now.getTimezoneOffset();
            const localDate = new Date(now.getTime() - (offset*60*1000));
            inicioInput.value = localDate.toISOString().slice(0, 16);
        }
    }
});
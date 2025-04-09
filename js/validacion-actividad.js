import { region_comuna } from './region_comuna.js';

document.addEventListener("DOMContentLoaded", function () {
	let regionInput = document.getElementById("region");
	let comunaInput = document.getElementById("comuna");

	// menú de regiones
	regionInput.innerHTML = '<option value="sin-region">-- Seleccione región --</option>';
	region_comuna.regiones.forEach((region) => {
		const option = document.createElement("option");
		option.value = region.nombre;
		option.text = region.nombre;
		regionInput.appendChild(option);
	});

	// menú para comuna a partir de región seleccionada
	regionInput.addEventListener("change", () => {
		const selectedRegion = regionInput.value;
		comunaInput.innerHTML = '<option value="sin-comuna">-- Seleccione comuna --</option>';
		if (selectedRegion !== "sin-region") {
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
	});

	// agregamos el evento para escoger la fecha y hora de inicio y término
	const inicioInput = document.getElementById('inicio');
	const terminoInput = document.getElementById('termino');
	const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;

	const now = new Date();
	const formattedNow = now.toISOString().slice(0, 16);
	inicioInput.value = formattedNow;

	inicioInput.addEventListener('change', () => {
		const inicioDate = new Date(inicioInput.value);
		if (!isNaN(inicioDate.getTime())) {
			const terminoDate = new Date(inicioDate.getTime() + THREE_HOURS_IN_MS);
			terminoInput.value = terminoDate.toISOString().slice(0, 16);
		}
	});

	terminoInput.addEventListener('input', () => {
		const inicioDate = new Date(inicioInput.value);
		const terminoDate = new Date(terminoInput.value);
		if (terminoDate <= inicioDate) {
			alert('La fecha y hora de término debe ser mayor a la de inicio.');
			terminoInput.value = '';
		}
	});

	// función de validación del formulario
	let botonCreado = false;
	function validarForm() {
		const sectorInput = document.getElementById("sector").value;
		const nombreInput = document.getElementById("nombre").value;
		const emailInput = document.getElementById("email").value;
		const telefonoInput = document.getElementById("telefono").value;
		const inputsContacto = document.getElementById('inputs-contacto').querySelectorAll('.contacto-input');
		// variable de validación de formulario
		let msg = "";
		let isValid = false;

		// validaciones de ¿dónde?
		if (regionInput.value === "sin-region") {
			msg += "Por favor, seleccione la región y comuna de dónde será la actividad.\n";
		}

		if (regionInput.value !== "sin-region" && comunaInput.value === "sin-comuna") {
			msg += "Por favor, seleccione la comuna de dónde será la actividad.\n";
		}

		if (sectorInput.length > 100) {
			msg += "El sector no puede tener más de 100 caracteres.\n";
		}

		// validaciones de datos organizador
		if (nombreInput.trim() === "") {
			msg += "Por favor, ingrese su nombre.\n";
		}
		if (nombreInput.length > 200) {
			msg += "El nombre no puede tener más de 200 caracteres.\n";
		}

		if (emailInput.trim() === "") {
			msg += "Por favor, ingrese su email.\n";
		}

		const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
		if (!emailRegex.test(emailInput)) {
			msg += "Dirección de correo electrónico inválida.\n";
		}

		if (emailInput.length > 100) {
			msg += "El email no puede tener más de 100 caracteres.\n";
		}

		if (telefonoInput.trim() !== "") {
			if (!/^(\+56\d{9}|\d{9})$/.test(telefonoInput)) {
				msg += "Número incorrecto.\n";
			}
		}

		inputsContacto.forEach(input => {
			const valor = input.querySelector('input').value;
			if (valor.length < 4 || valor.length > 50) {
				msg += `El campo de contacto "${input.dataset.medio}" debe tener entre 4 y 50 caracteres.\n`;
			}
		});

		// validaciones de ¿Cuándo y de qué trata?
		const inicioInput = document.getElementById('inicio');
		const terminoInput = document.getElementById('termino');
		const inicioFecha = new Date(inicioInput.value);
		const terminoFecha = new Date(terminoInput.value);
		const descripcionInput = document.getElementById('descripcion');

		if (inicioInput.value.trim() === "") {
			msg += "Por favor, seleccione la fecha y hora de inicio.\n";
		} else if (isNaN(new Date(inicioInput.value).getTime())) {
			msg += "La fecha y hora de inicio no es válida.\n";
		}

		if (inicioFecha > terminoFecha) {
			msg += "La fecha y hora de término debe ser mayor a día y hora de inicio.\n";
		}

		if (descripcionInput.value.length > 500) {
			msg += "La descripción no puede tener más de 500 caracteres.\n";
		}

		//validacion de temas seleccionados
		const temasSeleccionados = document.querySelectorAll('#dropdown-menu input[type="checkbox"]:checked');
		const otroCheckbox = document.querySelector('input[value="otro"]');

		if (temasSeleccionados.length === 0 && (!otroCheckbox.checked || !otroTemaInput.value.trim())) {
			msg += "Debe seleccionar al menos un tema o especificar uno en 'Otro'.\n";
		} else if (otroCheckbox.checked) {
			const otroTemaValor = otroTemaInput.value.trim();
			if (otroTemaValor.length < 3 || otroTemaValor.length > 15) {
				msg += "El tema especificado en 'Otro' debe tener entre 3 y 15 caracteres.\n";
			}
		}

		//validación de fotos
		const fotos = document.querySelectorAll('#fotos-container input[type="file"]');
		if (fotos.length === 0) {
			msg += "Debe agregar al menos una imagen.\n";
		} else if (fotos.length > 5) {
			msg += "No puede agregar más de 5 imágenes.\n";
		} else {
			const formatosValidos = ['image/jpeg', 'image/png', 'image/gif'];
			fotos.forEach(foto => {
				if (foto.files.length > 0 && !formatosValidos.includes(foto.files[0].type)) {
					msg += `El archivo ${foto.files[0].name} no es un formato válido. Solo se permiten imágenes JPEG, PNG o GIF.\n`;
				}
			});
		}

		// determinamos si el formulario es válido
		if (msg === "") {
			isValid = true;
			if (!botonCreado) {
				// mostramos mensaje para preguntar por la confirmación de los datos
				let confirmaRegistroDiv = document.createElement("div");
				confirmaRegistroDiv.id = "confirmaRegistro";
				let mensajeConfirmaRegistro = document.createElement("p");
				mensajeConfirmaRegistro.innerText = "¿Está seguro que desea agregar esta actividad?";
				confirmaRegistroDiv.appendChild(mensajeConfirmaRegistro);
				// agregamos un botón para confirmar
				let yesBtn = document.createElement("button");
				yesBtn.id = "yes";
				yesBtn.textContent = "Sí, confirmo";
				confirmaRegistroDiv.appendChild(yesBtn);
				// aggregamos un botón para no confirmar
				let noBtn = document.createElement("button");
				noBtn.textContent = "No, no estoy seguro, quiero volver al formulario";
				noBtn.id = "no";
				confirmaRegistroDiv.appendChild(noBtn);
				document.body.appendChild(confirmaRegistroDiv);
				// la variable botonCreado se usa para que solo se cree un solo botón de confirmar
				// al clickear registrar
				botonCreado = true;
				// agregamos eventos oyentes
				yesBtn.addEventListener("click", yesEvent);
				noBtn.addEventListener("click", noEvent);
			}
		}

		// mostramos los errores si es que hay en el formulario
		if (!isValid) {
			alert(msg);
		}
	}

	const yesEvent = () => {
		// referencia al formulario
		let formulario = document.getElementById("formulario");
		// reseteamos el formulario ya que se guardaron los datos
		formulario.reset();

		// si se confirma el registro, se borra de la pantalla el botón de confirmar registro
		let confirmaRegistro = document.getElementById("confirmaRegistro");
		if (confirmaRegistro) {
			confirmaRegistro.remove();
		}

		// habilitamos nuevamente el botón de registrar actividad
		let botonRegistroActividad = document.getElementById("botonRegistroActividad");
		botonRegistroActividad.disabled = false;

		// mostramos mensaje que se ha recibido el registro
		let registroExitosoDiv = document.createElement("div");
		registroExitosoDiv.id = "registroExitoso";
		let mensajeRegistroExitoso = document.createElement("p");
		mensajeRegistroExitoso.innerText = "Hemos recibido el registro de la actividad. Muchas gracias";
		registroExitosoDiv.appendChild(mensajeRegistroExitoso);
		registroExitosoDiv.style.display = "block";
		//agregamos un boton para volver al inicio
		let botonVolver = document.createElement("button");
		botonVolver.id = "botonVolver";
		botonVolver.textContent = "Regresar";
		registroExitosoDiv.appendChild(botonVolver);
		document.body.appendChild(registroExitosoDiv);
		//agregamos evento para volver
		botonVolver.addEventListener("click", function() {
			window.location.href = "../html/portada.html";
		})

		
		
	};

	const noEvent = () => {
		// si no se confirma el registro, se borra de la pantalla el botón de confirmar registro
		let confirmaRegistro = document.getElementById("confirmaRegistro");
		if (confirmaRegistro) {
			confirmaRegistro.remove();
		}

		// habilitamos nuevamente el boton de registrar actividad
		let botonRegistroActividad = document.getElementById("botonRegistroActividad");
		botonRegistroActividad.disabled = false;

	};

	// oyente de evento al botón de envío registro
	let submitBtn = document.getElementById("botonRegistroActividad");
	submitBtn.disabled = false;
	submitBtn.addEventListener("click", validarForm);

	// función para agregar contacto
	function agregarContacto() {
		const seleccionar = document.getElementById('contactar-por');
		const inputsContacto = document.getElementById('inputs-contacto');
		const inputs = inputsContacto.querySelectorAll('.contacto-input');

		if (seleccionar && inputs.length < 5 && seleccionar.value) {
			const medio = seleccionar.value;
			const existe = Array.from(inputs).some(input => input.dataset.medio === medio);

			if (!existe) {
				const div = document.createElement('div');
				div.className = 'contacto-input';
				div.dataset.medio = medio;

				const label = document.createElement('label');
				label.textContent = `${medio.charAt(0).toUpperCase() + medio.slice(1)}:`;
				label.setAttribute('for', `${medio}-input`);

				const input = document.createElement('input');
				input.type = 'text';
				input.id = `${medio}-input`;
				input.name = medio;

				const botonEliminar = document.createElement('button');
				botonEliminar.type = 'button';
				botonEliminar.textContent = 'Eliminar';
				botonEliminar.onclick = () => div.remove();

				div.appendChild(label);
				div.appendChild(input);
				div.appendChild(botonEliminar);
				inputsContacto.appendChild(div);
			} else {
				alert(`Ya se agregó un campo para ${medio}.`);
			}
		} else if (inputs.length >= 5) {
			alert('Solo puedes agregar hasta 5 medios de contacto.');
		}
		seleccionar.value = '';
	}

	// agregamos el detector de eventos al elemento select
	const selectContacto = document.getElementById('contactar-por');
	selectContacto.addEventListener('change', agregarContacto);
	const dropdownButton = document.querySelector('.dropdown-button');
	const dropdownMenu = document.getElementById('dropdown-menu');
	const otroTemaDiv = document.getElementById('otro-tema');
	const otroTemaInput = document.getElementById('otro-tema-input');
	const guardarOtroTemaButton = otroTemaDiv.querySelector('button');

	dropdownButton.addEventListener('click', () => {
		dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
	});

	// evento para mostrar/ocultar el input "Otro"
	const otroCheckbox = document.querySelector('input[value="otro"]');
	otroCheckbox.addEventListener('change', () => {
		otroTemaDiv.style.display = otroCheckbox.checked ? 'block' : 'none';
	});

	guardarOtroTemaButton.addEventListener('click', guardarOtroTema);

	function guardarOtroTema() {
		const valor = otroTemaInput.value.trim();
		if (valor.length >= 3 && valor.length <= 15) {
			alert(`Tema guardado: ${valor}`);
			otroTemaInput.value = ''; // limpia el campo después de guardar
		} else {
			alert('El tema debe tener entre 3 y 15 caracteres.');
		}
	}

	document.querySelector('form').addEventListener('submit', function (event) {
		event.preventDefault(); // evita que la página se recargue

		const checkboxes = document.querySelectorAll('#dropdown-menu input[type="checkbox"]:checked'); //seleccionamos los marcados
		const temasSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);

		// agregar el valor de "Otro" si está presente
		if (otroTemaInput.value.trim()) {
			temasSeleccionados.push(otroTemaInput.value.trim());
		}
	});

	const fotosContainer = document.getElementById('fotos-container');
	const agregarFotoButton = document.getElementById('foto-input').querySelector('button');
	let contadorFotos = 0;

	agregarFotoButton.addEventListener('click', agregarFoto);

	function agregarFoto() {
		if (contadorFotos < 5) {
			crearInputFoto();
			contadorFotos++;
		} else {
			//evitamos que siga agregando fotos
			alert('Solo puedes agregar hasta 5 fotos.');
		}
	}

	function crearInputFoto() {
		const nuevaFotoWrapper = document.createElement('div');
		nuevaFotoWrapper.className = 'foto-wrapper';

		const nuevoInput = document.createElement('input');
		nuevoInput.type = 'file';
		nuevoInput.id = `foto-${contadorFotos + 1}`;
		nuevoInput.name = 'fotos[]';
		nuevoInput.accept = "image/*";
		nuevoInput.required = contadorFotos === 0;

		const botonEliminar = document.createElement('button');
		botonEliminar.type = 'button';
		botonEliminar.textContent = 'Eliminar';
		botonEliminar.addEventListener('click', () => {
			nuevaFotoWrapper.remove();
			contadorFotos--;
		});
		nuevaFotoWrapper.appendChild(nuevoInput);
		nuevaFotoWrapper.appendChild(botonEliminar);
		fotosContainer.appendChild(nuevaFotoWrapper);
	}
});

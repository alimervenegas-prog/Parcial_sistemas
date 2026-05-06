document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-paciente');
    const tablaBody = document.getElementById('lista-pacientes-body');
    const inputBusqueda = document.getElementById('busqueda');
    const selectAlergias = document.getElementById('alergias');
    const inputOtroAlergia = document.getElementById('otroAlergia');

    // Mostrar campo "Otro" en alergias
    selectAlergias.addEventListener('change', () => {
        const values = Array.from(selectAlergias.selectedOptions).map(opt => opt.value);
        inputOtroAlergia.classList.toggle('hidden', !values.includes('Otro'));
    });

    // Cargar datos iniciales
    const cargarPacientes = (filtro = '') => {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        tablaBody.innerHTML = '';

        const filtrados = pacientes.filter(p => 
            p.dni.includes(filtro) || 
            p.apellidos.toLowerCase().includes(filtro.toLowerCase())
        );

        filtrados.forEach(p => {
            const edad = calcularEdad(p.fechaNac);
            const row = `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.apellidos}, ${p.nombres}</td>
                    <td>${p.dni}</td>
                    <td>${edad} años</td>
                    <td><span class="tag">${p.alergiasDetalle}</span></td>
                    <td>
                        <button onclick="eliminarPaciente('${p.id}')" class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += row;
        });
    };

    const calcularEdad = (fecha) => {
        const hoy = new Date();
        const cumple = new Date(fecha);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        if (hoy.getMonth() < cumple.getMonth() || (hoy.getMonth() == cumple.getMonth() && hoy.getDate() < cumple.getDate())) edad--;
        return edad;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        const dni = document.getElementById('dni').value;

        // Validación: DNI no repetido
        if (pacientes.some(p => p.dni === dni)) {
            alert("Error: Este DNI ya está registrado.");
            return;
        }

        // Procesar Alergias
        let alergiasSeleccionadas = Array.from(selectAlergias.selectedOptions).map(opt => opt.value);
        if (alergiasSeleccionadas.includes('Otro')) {
            alergiasSeleccionadas = alergiasSeleccionadas.filter(a => a !== 'Otro');
            alergiasSeleccionadas.push(inputOtroAlergia.value);
        }

        const nuevoPaciente = {
            id: `PAC${(pacientes.length + 1).toString().padStart(3, '0')}`,
            nombres: document.getElementById('nombres').value.trim(),
            apellidos: document.getElementById('apellidos').value.trim(),
            dni: dni,
            fechaNac: document.getElementById('fechaNac').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            alergiasDetalle: alergiasSeleccionadas.join(', '),
            contactoEmergencia: {
                nombre: document.getElementById('contactoNombre').value,
                tel: document.getElementById('contactoTel').value
            }
        };

        pacientes.push(nuevoPaciente);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        form.reset();
        inputOtroAlergia.classList.add('hidden');
        cargarPacientes();
        alert("Paciente registrado con éxito.");
    });

    inputBusqueda.addEventListener('input', (e) => cargarPacientes(e.target.value));

    // Función global para eliminar (requerida para el botón de la tabla)
    window.eliminarPaciente = (id) => {
        if (confirm("¿Está seguro de eliminar este registro?")) {
            let pacientes = JSON.parse(localStorage.getItem('pacientes'));
            pacientes = pacientes.filter(p => p.id !== id);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            cargarPacientes();
        }
    };

    cargarPacientes();
});
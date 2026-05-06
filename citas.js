document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-citas');
    const selectPaciente = document.getElementById('select-paciente');
    const tablaBody = document.getElementById('lista-citas-body');
    const prioridadSelect = document.getElementById('prioridad');
    const campoUrgencia = document.getElementById('campo-urgencia');

    // 1. Cargar pacientes registrados en el selector
    const cargarPacientesSelect = () => {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        selectPaciente.innerHTML = '<option value="">Seleccione un paciente...</option>';
        pacientes.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.apellidos}, ${p.nombres} (${p.dni})`;
            selectPaciente.appendChild(option);
        });
    };

    // 2. Manejar campo de urgencia
    prioridadSelect.addEventListener('change', () => {
        campoUrgencia.classList.toggle('hidden', prioridadSelect.value !== 'Urgente');
        document.getElementById('justificacion').required = (prioridadSelect.value === 'Urgente');
    });

    // 3. Guardar Cita con validaciones
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const citas = JSON.parse(localStorage.getItem('citas')) || [];
        const fechaVal = document.getElementById('fecha-cita').value;
        const horaVal = document.getElementById('hora-cita').value;
        const medicoVal = document.getElementById('medico').value;
        const pacienteID = selectPaciente.value;

        // Validación: Fecha no sea pasada
        const hoy = new Date().toISOString().split('T')[0];
        if (fechaVal < hoy) {
            alert("No se pueden programar citas en fechas pasadas.");
            return;
        }

        // Validación: Conflicto de horario (Médico o Paciente ocupado)
        const conflicto = citas.some(c => 
            c.fecha === fechaVal && 
            c.hora === horaVal && 
            (c.medico === medicoVal || c.pacienteID === pacienteID) &&
            c.estado !== 'Cancelada'
        );

        if (conflicto) {
            alert("Conflicto: El médico o el paciente ya tienen una cita programada en ese horario.");
            return;
        }

        const nuevaCita = {
            id: `CITA${(citas.length + 1).toString().padStart(3, '0')}`,
            pacienteID: pacienteID,
            pacienteNombre: selectPaciente.options[selectPaciente.selectedIndex].text,
            especialidad: document.getElementById('especialidad').value,
            medico: medicoVal,
            fecha: fechaVal,
            hora: horaVal,
            prioridad: prioridadSelect.value,
            motivo: document.getElementById('motivo').value,
            justificacion: document.getElementById('justificacion').value,
            estado: 'Programada'
        };

        citas.push(nuevaCita);
        localStorage.setItem('citas', JSON.stringify(citas));
        form.reset();
        campoUrgencia.classList.add('hidden');
        cargarCitas();
        alert("Cita programada con éxito.");
    });

    // 4. Listar citas
    window.cargarCitas = () => {
        const citas = JSON.parse(localStorage.getItem('citas')) || [];
        tablaBody.innerHTML = '';

        citas.forEach(c => {
            const row = `
                <tr class="row-${c.estado.toLowerCase()}">
                    <td>${c.id}</td>
                    <td>${c.pacienteNombre}</td>
                    <td>${c.medico}</td>
                    <td>${c.fecha} | ${c.hora}</td>
                    <td><span class="badge ${c.prioridad.toLowerCase()}">${c.prioridad}</span></td>
                    <td><strong>${c.estado}</strong></td>
                    <td>
                        ${c.estado === 'Programada' ? 
                            `<button onclick="cancelarCita('${c.id}')" class="btn-sm btn-danger">Cancelar</button>
                             <button onclick="confirmarAsistencia('${c.id}')" class="btn-sm btn-success">Llegó</button>` : 
                            `<span class="text-muted">Sin acciones</span>`}
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += row;
        });
    };

    window.cancelarCita = (id) => {
        const motivo = prompt("Motivo de cancelación:");
        if (motivo && motivo.length >= 5) {
            let citas = JSON.parse(localStorage.getItem('citas'));
            const index = citas.findIndex(c => c.id === id);
            citas[index].estado = 'Cancelada';
            citas[index].motivoCancelacion = motivo;
            localStorage.setItem('citas', JSON.stringify(citas));
            cargarCitas();
        } else {
            alert("Debe indicar un motivo válido.");
        }
    };

    window.confirmarAsistencia = (id) => {
        let citas = JSON.parse(localStorage.getItem('citas'));
        const index = citas.findIndex(c => c.id === id);
        citas[index].estado = 'En espera'; // Pasa a Sala de Espera
        citas[index].horaLlegada = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        localStorage.setItem('citas', JSON.stringify(citas));
        alert("Paciente enviado a Sala de Espera.");
        cargarCitas();
    };

    cargarPacientesSelect();
    cargarCitas();
});
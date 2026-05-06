document.addEventListener('DOMContentLoaded', () => {
    const selectCita = document.getElementById('select-cita-atendida');
    const seccionRegistro = document.getElementById('seccion-registro');
    const infoPaciente = document.getElementById('info-paciente-atencion');
    const formHistorial = document.getElementById('form-historial');
    const contenedorHistoriales = document.getElementById('contenedor-historiales');
    const inputBuscar = document.getElementById('buscar-historial');

    // 1. Cargar citas que ya fueron atendidas y no tienen historial aún
    const actualizarSelectCitas = () => {
        const citas = JSON.parse(localStorage.getItem('citas')) || [];
        const historiales = JSON.parse(localStorage.getItem('historiales')) || [];
        
        // Filtrar: Atendidas y que no tengan ID en historiales
        const atendidasSinHistorial = citas.filter(c => 
            c.estado === 'Atendido' && !historiales.some(h => h.citaID === c.id)
        );

        selectCita.innerHTML = '<option value="">Seleccione la cita para registrar...</option>';
        atendidasSinHistorial.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.pacienteNombre} - ${c.especialidad} (${c.fecha})`;
            selectCita.appendChild(opt);
        });
    };

    // 2. Mostrar formulario al seleccionar cita
    selectCita.addEventListener('change', () => {
        const citaID = selectCita.value;
        if (!citaID) {
            seccionRegistro.classList.add('hidden');
            return;
        }

        const citas = JSON.parse(localStorage.getItem('citas'));
        const cita = citas.find(c => c.id === citaID);
        
        seccionRegistro.classList.remove('hidden');
        infoPaciente.innerHTML = `
            <strong>Paciente:</strong> ${cita.pacienteNombre} | 
            <strong>Médico:</strong> ${cita.medico} | 
            <strong>Motivo inicial:</strong> ${cita.motivo}
        `;
    });

    // 3. Guardar Historial
    formHistorial.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const historiales = JSON.parse(localStorage.getItem('historiales')) || [];
        const citas = JSON.parse(localStorage.getItem('citas'));
        const citaActual = citas.find(c => c.id === selectCita.value);

        const nuevoHistorial = {
            id: `HIST${Date.now()}`,
            citaID: citaActual.id,
            pacienteID: citaActual.pacienteID,
            pacienteNombre: citaActual.pacienteNombre,
            medico: citaActual.medico,
            especialidad: citaActual.especialidad,
            fecha: new Date().toLocaleDateString(),
            sintomas: document.getElementById('sintomas').value,
            diagnostico: document.getElementById('diagnostico').value,
            tratamiento: document.getElementById('tratamiento').value,
            receta: {
                medicamento: document.getElementById('med-nombre').value,
                dosis: document.getElementById('med-dosis').value
            }
        };

        historiales.push(nuevoHistorial);
        localStorage.setItem('historiales', JSON.stringify(historiales));
        
        formHistorial.reset();
        seccionRegistro.classList.add('hidden');
        actualizarSelectCitas();
        mostrarHistoriales();
        alert("Historial médico guardado correctamente.");
    });

    // 4. Mostrar historiales guardados
    window.mostrarHistoriales = (filtro = '') => {
        const historiales = JSON.parse(localStorage.getItem('historiales')) || [];
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        
        contenedorHistoriales.innerHTML = '';

        const filtrados = historiales.filter(h => {
            const p = pacientes.find(pac => pac.id === h.pacienteID);
            return p && (p.dni.includes(filtro) || h.pacienteNombre.toLowerCase().includes(filtro.toLowerCase()));
        });

        filtrados.reverse().forEach(h => {
            const card = document.createElement('div');
            card.className = 'historial-card';
            card.innerHTML = `
                <div class="historial-header">
                    <span><strong>Fecha:</strong> ${h.fecha}</span>
                    <span><strong>Médico:</strong> ${h.medico} (${h.especialidad})</span>
                </div>
                <div class="historial-body">
                    <p><strong>Paciente:</strong> ${h.pacienteNombre}</p>
                    <p><strong>Diagnóstico:</strong> ${h.diagnostico}</p>
                    <p><strong>Tratamiento:</strong> ${h.tratamiento}</p>
                    ${h.receta.medicamento ? `<div class="receta-box">💊 ${h.receta.medicamento} - ${h.receta.dosis}</div>` : ''}
                </div>
            `;
            contenedorHistoriales.appendChild(card);
        });
    };

    inputBuscar.addEventListener('input', (e) => mostrarHistoriales(e.target.value));

    actualizarSelectCitas();
    mostrarHistoriales();
});
document.addEventListener('DOMContentLoaded', () => {
    const tablaBody = document.getElementById('lista-espera-body');
    const contador = document.getElementById('contador-espera');

    const actualizarSala = () => {
        const citas = JSON.parse(localStorage.getItem('citas')) || [];
        
        // 1. Filtrar solo los que están en espera o atención
        let enSala = citas.filter(c => c.estado === 'En espera' || c.estado === 'En atención');

        // 2. Definir pesos de prioridad para el ordenamiento
        const pesos = { 'Urgente': 1, 'Preferencial': 2, 'Normal': 3 };

        // 3. Ordenar por Prioridad y luego por Hora de llegada
        enSala.sort((a, b) => {
            if (pesos[a.prioridad] !== pesos[b.prioridad]) {
                return pesos[a.prioridad] - pesos[b.prioridad];
            }
            return a.horaLlegada.localeCompare(b.horaLlegada);
        });

        tablaBody.innerHTML = '';
        contador.textContent = `En espera: ${enSala.filter(c => c.estado === 'En espera').length}`;

        if (enSala.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">No hay pacientes en espera actualmente.</td></tr>';
            return;
        }

        enSala.forEach(c => {
            const row = `
                <tr class="row-status-${c.estado.replace(' ', '-').toLowerCase()}">
                    <td><span class="badge ${c.prioridad.toLowerCase()}">${c.prioridad}</span></td>
                    <td>
                        <strong>${c.pacienteNombre}</strong><br>
                        <small>${c.justificacion ? '⚠️ ' + c.justificacion : ''}</small>
                    </td>
                    <td>${c.medico} <br> <small class="text-muted">${c.especialidad}</small></td>
                    <td>${c.horaLlegada}</td>
                    <td><span class="status-tag">${c.estado}</span></td>
                    <td>
                        ${c.estado === 'En espera' ? 
                            `<button onclick="llamarPaciente('${c.id}')" class="btn-sm btn-call">Llamar <i class="fas fa-bullhorn"></i></button>` : 
                            `<button onclick="finalizarAtencion('${c.id}')" class="btn-sm btn-success">Finalizar</button>`
                        }
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += row;
        });
    };

    // Cambiar estado a "En atención"
    window.llamarPaciente = (id) => {
        let citas = JSON.parse(localStorage.getItem('citas'));
        const index = citas.findIndex(c => c.id === id);
        
        citas[index].estado = 'En atención';
        localStorage.setItem('citas', JSON.stringify(citas));
        actualizarSala();
        alert(`Paciente ${citas[index].pacienteNombre} llamado a consultorio.`);
    };

    // Cambiar estado a "Atendido" para que pase al módulo de Historial
    window.finalizarAtencion = (id) => {
        let citas = JSON.parse(localStorage.getItem('citas'));
        const index = citas.findIndex(c => c.id === id);
        
        citas[index].estado = 'Atendido';
        localStorage.setItem('citas', JSON.stringify(citas));
        actualizarSala();
        alert("Atención finalizada. Ahora puede registrar el historial médico.");
    };

    // Recargar automáticamente cada 30 segundos para simular tiempo real
    setInterval(actualizarSala, 30000);
    actualizarSala();
});
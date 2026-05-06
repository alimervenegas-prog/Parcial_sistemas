🏥 **Sistema de Gestión de Clínica - Grupo 6 / VITALIS**

👥 Integrantes

    Alimer Venegas - Responsable del Módulo 1 y 2

    Ivana Gygax - Responsable de introducción, merge ramas y adición de datos.

    Leonel Urbano - Responsable del Módulo 3 y 4

📝 **Descripción del Sistema**
Este sistema es una solución web funcional diseñada para gestionar el flujo operativo básico de una clínica o consultorio médico. El proyecto permite el seguimiento completo del paciente, desde su registro inicial hasta la culminación de su consulta médica, garantizando la persistencia de datos y la integridad de la información mediante validaciones lógicas.  

Problema que resuelve: Optimiza la organización administrativa y médica al digitalizar el registro de pacientes, la agenda de citas, el control de turnos en sala de espera y el archivo de historias clínicas en un entorno local.

🧩 **Módulos Desarrollados**

    *1. Registro de Pacientes*
Funcionalidad: Permite el alta de pacientes con validaciones estrictas de DNI (8 dígitos), edad automática y registro de alergias.

Dato Clave: Los pacientes registrados aquí son la base para el resto del sistema.

    *2. Programación de Citas Médicas*
Funcionalidad: Gestión de agenda por especialidad y médico. Incluye validaciones para evitar cruces de horarios y fechas pasadas.

Relación: Consume la lista de pacientes registrados en el Módulo 1.

    *3. Sala de Espera Virtual*
Funcionalidad: Tablero de control de pacientes que han llegado a la clínica. Gestiona el orden de atención basado en prioridades (Urgente > Preferencial > Normal).

Relación: Recibe las citas confirmadas del Módulo 2.

    *4. Historial de Consultas*
Funcionalidad: Registro detallado del diagnóstico, síntomas, tratamiento y recetas médicas de cada atención finalizada.

Relación: Solo permite generar registros de citas marcadas como "Atendidas" en el Módulo 3.

🛠️ **Tecnologías Utilizadas**
Lenguajes: HTML5, CSS3, JavaScript (Vanilla JS).  

Almacenamiento: localStorage para persistencia de datos sin base de datos externa.  

Control de Versiones: Git y GitHub.  

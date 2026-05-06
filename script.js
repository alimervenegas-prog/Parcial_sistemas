// Inicialización del sistema
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Vitalis iniciado.");
    
    // Función para inicializar datos si el localStorage está vacío
    // Esto evita errores cuando tus compañeros intenten leer listas vacías.
    const initStorage = () => {
        if (!localStorage.getItem('pacientes')) {
            localStorage.setItem('pacientes', JSON.stringify([]));
        }
        if (!localStorage.getItem('citas')) {
            localStorage.setItem('citas', JSON.stringify([]));
        }
        if (!localStorage.getItem('consultas')) {
            localStorage.setItem('consultas', JSON.stringify([]));
        }
    };

    initStorage();

    // Efecto de entrada suave para las tarjetas
    const cards = document.querySelectorAll('.module-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
});
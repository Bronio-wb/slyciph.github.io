// ============================================================================
// DATOS SIMULADOS PARA LA PLATAFORMA
// ============================================================================

// Objeto que simula al usuario autenticado actualmente en el sistema.
// Contiene un ID único, nombre, correo electrónico y rol (Admin en este caso).
// Estos datos se usarían normalmente desde una base de datos o autenticación real.
let currentUser = {
    id: 1,                          // Identificador único del usuario
    nombre: "Juan Pérez",           // Nombre completo del usuario
    email: "juan@example.com",      // Correo electrónico asociado al usuario
    rol: "Admin"                    // Rol del usuario que define sus permisos (Admin, Estudiante, etc.)
};

// Array que almacena los cursos disponibles en la plataforma como datos simulados.
// Cada curso tiene un ID, título, descripción, porcentaje de progreso y estado de inscripción.
const courses = [
    { id: 1, title: "Aprende Python", description: "Domina los fundamentos de Python.", progress: 75, enrolled: true },    // Curso 1: 75% completado, inscrito
    { id: 2, title: "JavaScript Básico", description: "Crea aplicaciones web interactivas.", progress: 30, enrolled: true }, // Curso 2: 30% completado, inscrito
    { id: 3, title: "HTML y CSS", description: "Diseña páginas web modernas.", progress: 90, enrolled: false }             // Curso 3: 90% completado, no inscrito
];

// Array que simula la lista de usuarios registrados en la plataforma.
// Se utiliza principalmente en el dashboard de administrador para gestionar usuarios.
const users = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Estudiante", status: "Activo" },    // Usuario 1: Estudiante activo
    { id: 2, name: "María Gómez", email: "maria@example.com", role: "Admin", status: "Activo" },      // Usuario 2: Admin activo
    { id: 3, name: "Carlos López", email: "carlos@example.com", role: "Estudiante", status: "Bloqueado" }, // Usuario 3: Estudiante bloqueado
    { id: 4, name: "Ana Martínez", email: "ana@example.com", role: "Estudiante", status: "Activo" },    // Usuario 4: Estudiante activo
    { id: 5, name: "Pedro Sánchez", email: "pedro@example.com", role: "Profesor", status: "Activo" },   // Usuario 5: Profesor activo
    { id: 6, name: "Lucía Ramírez", email: "lucia@example.com", role: "Estudiante", status: "Bloqueado" }, // Usuario 6: Estudiante bloqueado
    { id: 7, name: "José García", email: "jose@example.com", role: "Admin", status: "Activo" },        // Usuario 7: Admin activo
    { id: 8, name: "Sofía Díaz", email: "sofia@example.com", role: "Estudiante", status: "Activo" },    // Usuario 8: Estudiante activo
    { id: 9, name: "Miguel Torres", email: "miguel@example.com", role: "Estudiante", status: "Bloqueado" } // Usuario 9: Estudiante bloqueado
];

// ============================================================================
// FUNCIONES PARA CARGAR CONTENIDO EN EL DASHBOARD
// ============================================================================

// Función que carga solo los cursos en los que el usuario está inscrito.
// Se muestra en la sección "Cursos Disponibles" del dashboard.
function loadCourses() {
    const coursesGrid = document.getElementById('courses-grid'); // Obtiene el contenedor HTML donde se mostrarán los cursos
    coursesGrid.innerHTML = ''; // Limpia el contenido previo del contenedor para evitar duplicados
    const enrolledCourses = courses.filter(course => course.enrolled); // Filtra los cursos donde enrolled es true
    enrolledCourses.forEach(course => { // Itera sobre cada curso inscrito
        const courseCard = document.createElement('div'); // Crea un nuevo elemento div para cada tarjeta de curso
        courseCard.classList.add('course-card'); // Añade la clase CSS 'course-card' para el estilo
        courseCard.innerHTML = `
            <h3>${course.title}</h3>              <!-- Título del curso -->
            <p>${course.description}</p>          <!-- Descripción del curso -->
        `; // Inserta el título y descripción en la tarjeta
        coursesGrid.appendChild(courseCard); // Agrega la tarjeta al contenedor en el DOM
    });
}

// Función que calcula y muestra el progreso general del estudiante.
// Actualiza la barra de progreso, texto y detalles por curso en la sección "Tu Progreso".
function loadProgress() {
    const progressFill = document.getElementById('progress-fill'); // Obtiene la barra de progreso visual
    const progressText = document.getElementById('progress-text'); // Obtiene el texto que muestra el porcentaje
    const progressDetails = document.getElementById('progress-details'); // Obtiene el contenedor de detalles
    progressDetails.innerHTML = ''; // Limpia los detalles previos para actualizarlos
    const enrolledCourses = courses.filter(course => course.enrolled); // Filtra cursos inscritos
    const totalProgress = enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length || 0; // Calcula el promedio de progreso
    progressFill.style.width = `${totalProgress}%`; // Actualiza el ancho de la barra de progreso
    progressText.textContent = `Progreso: ${Math.round(totalProgress)}%`; // Muestra el porcentaje redondeado

    enrolledCourses.forEach(course => { // Itera sobre cada curso inscrito
        const progressCard = document.createElement('div'); // Crea una tarjeta para cada curso
        progressCard.classList.add('progress-card'); // Añade la clase CSS 'progress-card'
        progressCard.innerHTML = `
            <h3>${course.title}</h3>              <!-- Título del curso -->
            <div class="progress-bar">            <!-- Contenedor de la barra de progreso -->
                <div class="progress-fill" style="width: ${course.progress}%"></div> <!-- Barra de progreso individual -->
            </div>
            <p>Progreso: ${course.progress}%</p>  <!-- Porcentaje de progreso -->
        `; // Inserta el contenido de la tarjeta
        progressDetails.appendChild(progressCard); // Agrega la tarjeta al contenedor
    });

    // Crea un gráfico de barras para visualizar el progreso de los cursos
    const ctx = document.getElementById('progress-chart').getContext('2d'); // Obtiene el contexto del lienzo del gráfico
    new Chart(ctx, { // Inicializa un nuevo gráfico usando Chart.js
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: enrolledCourses.map(c => c.title), // Etiquetas del eje X (títulos de cursos)
            datasets: [{ // Conjunto de datos para el gráfico
                label: 'Progreso (%)', // Etiqueta de la serie de datos
                data: enrolledCourses.map(c => c.progress), // Valores de progreso
                backgroundColor: '#1abc9c', // Color de fondo de las barras
                borderColor: '#16a085', // Color del borde de las barras
                borderWidth: 1 // Ancho del borde
            }]
        },
        options: { // Configuraciones del gráfico
            scales: { y: { beginAtZero: true, max: 100 } } // Escala Y empieza en 0 y tiene un máximo de 100
        }
    });
}

// Función que carga las estadísticas principales del estudiante en el dashboard.
// Muestra cursos completados, horas de estudio y puntos ganados.
function loadDashboard() {
    document.getElementById('completed-courses').textContent = courses.filter(c => c.progress === 100 && c.enrolled).length; // Cuenta cursos completados al 100%
    document.getElementById('study-hours').textContent = Math.round(courses.reduce((sum, c) => sum + (c.progress / 100 * 10), 0)); // Calcula horas estimadas (progreso * 10 horas)
    document.getElementById('points-earned').textContent = courses.reduce((sum, c) => sum + (c.progress * 10), 0); // Calcula puntos totales (progreso * 10 puntos)
}

// Función que carga la tabla de usuarios en el dashboard de administrador.
// Permite ver y gestionar la lista de usuarios registrados.
function loadUsers() {
    const usersTable = document.getElementById('users-table'); // Obtiene la tabla HTML donde se mostrarán los usuarios
    usersTable.innerHTML = ''; // Limpia el contenido previo de la tabla
    users.forEach(user => { // Itera sobre cada usuario en el array
        const row = document.createElement('tr'); // Crea una nueva fila de tabla
        const buttonClass = user.status === "Activo" ? "block-btn active" : "block-btn blocked"; // Define la clase del botón según el estado
        const buttonText = user.status === "Activo" ? "Bloquear" : "Desbloquear"; // Define el texto del botón según el estado
        row.innerHTML = `
            <td>${user.id}</td>          <!-- ID del usuario -->
            <td>${user.name}</td>        <!-- Nombre del usuario -->
            <td>${user.email}</td>       <!-- Correo del usuario -->
            <td>${user.role}</td>        <!-- Rol del usuario -->
            <td><button onclick="blockUser(${user.id})" class="${buttonClass}">${buttonText}</button></td> <!-- Botón para bloquear/desbloquear -->
        `; // Inserta los datos y el botón en la fila
        usersTable.appendChild(row); // Agrega la fila a la tabla en el DOM
    });
}

// Función que cambia el estado (Activo/Bloqueado) de un usuario.
// Simula una acción administrativa que se ejecutaría en una base de datos real.
function blockUser(userId) {
    const user = users.find(u => u.id === userId); // Busca el usuario por su ID en el array
    if (user) { // Verifica que el usuario exista
        if (user.status === "Activo") { // Si está activo, lo bloquea
            user.status = "Bloqueado";
            alert(`Usuario ${user.name} ha sido bloqueado.`); // Notifica al usuario
        } else { // Si está bloqueado, lo desbloquea
            user.status = "Activo";
            alert(`Usuario ${user.name} ha sido desbloqueado.`); // Notifica al usuario
        }
        loadUsers(); // Recarga la tabla de usuarios para reflejar el cambio
        loadStats(); // Actualiza las estadísticas para incluir el cambio
    }
}

// Función que carga la lista de cursos en el dashboard de administrador.
// Permite ver y gestionar los cursos disponibles.
function loadAdminCourses() {
    const adminCoursesList = document.getElementById('admin-courses-list'); // Obtiene el contenedor de la lista de cursos
    adminCoursesList.innerHTML = ''; // Limpia el contenido previo
    courses.forEach(course => { // Itera sobre cada curso
        const courseCard = document.createElement('div'); // Crea una tarjeta para cada curso
        courseCard.classList.add('course-card'); // Añade la clase CSS 'course-card'
        courseCard.innerHTML = `
            <h3>${course.title}</h3>              <!-- Título del curso -->
            <p>${course.description}</p>          <!-- Descripción del curso -->
            <button onclick="deleteCourse(${course.id})" class="delete-btn">Eliminar</button> <!-- Botón para eliminar el curso -->
        `; // Inserta el contenido de la tarjeta
        adminCoursesList.appendChild(courseCard); // Agrega la tarjeta al contenedor
    });

    // Maneja el formulario para agregar nuevos cursos
    const form = document.getElementById('add-course-form'); // Obtiene el formulario HTML
    if (form) { // Verifica que el formulario exista
        // Elimina cualquier listener previo para evitar duplicación de eventos
        const existingListener = form._submitListener;
        if (existingListener) {
            form.removeEventListener('submit', existingListener);
        }
        // Define el nuevo listener para el envío del formulario
        const submitListener = (e) => {
            e.preventDefault(); // Evita que el formulario se envíe de forma tradicional
            const title = document.getElementById('course-title').value; // Obtiene el título ingresado
            const description = document.getElementById('course-description').value; // Obtiene la descripción ingresada
            if (title && description) { // Verifica que ambos campos estén llenos
                // Verifica si ya existe un curso con el mismo título
                if (courses.some(c => c.title === title)) {
                    alert("Este curso ya existe. Por favor, usa un título diferente."); // Notifica duplicado
                    return;
                }
                const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1; // Genera un nuevo ID
                courses.push({ id: newId, title, description, progress: 0, enrolled: true }); // Agrega el nuevo curso
                loadAdminCourses(); // Recarga la lista de cursos en admin
                loadCourses(); // Recarga los cursos en la sección del estudiante
                loadProgress(); // Actualiza el progreso
                alert(`Curso "${title}" agregado exitosamente`); // Notifica éxito
                e.target.reset(); // Limpia el formulario
            } else {
                alert("Por favor, completa el título y la descripción."); // Notifica campos vacíos
            }
        };
        form.addEventListener('submit', submitListener); // Asocia el listener al evento submit
        form._submitListener = submitListener; // Guarda el listener como propiedad del formulario
    }
}

// Función que elimina un curso del sistema.
// Se activa al hacer clic en el botón "Eliminar" en el dashboard de administrador.
function deleteCourse(courseId) {
    const courseIndex = courses.findIndex(c => c.id === courseId); // Busca el índice del curso por ID
    if (courseIndex !== -1) { // Verifica que el curso exista
        const courseTitle = courses[courseIndex].title; // Guarda el título para la notificación
        courses.splice(courseIndex, 1); // Elimina el curso del array
        loadAdminCourses(); // Recarga la lista de cursos en admin
        loadCourses(); // Recarga los cursos en la sección del estudiante
        loadProgress(); // Actualiza el progreso
        alert(`Curso "${courseTitle}" eliminado exitosamente`); // Notifica éxito
    }
}

// Función que carga las estadísticas generales y un gráfico en el dashboard de administrador.
function loadStats() {
    const totalUsers = users.length; // Calcula el número total de usuarios
    const activeUsers = users.filter(u => u.status === "Activo").length; // Cuenta usuarios activos
    const blockedUsers = users.filter(u => u.status === "Bloqueado").length; // Cuenta usuarios bloqueados
    const activeCourses = courses.length; // Cuenta el número total de cursos

    document.getElementById('total-users').textContent = totalUsers; // Actualiza el total de usuarios
    document.getElementById('active-courses').textContent = activeCourses; // Actualiza el total de cursos
    document.getElementById('completed-lessons').textContent = courses.reduce((sum, c) => sum + (c.progress / 100 * 10), 0) * 50; // Calcula lecciones completadas

    // Crea o actualiza el gráfico de estadísticas
    const ctx = document.getElementById('stats-chart').getContext('2d'); // Obtiene el contexto del lienzo
    if (window.statsChart) { // Verifica si ya existe un gráfico
        window.statsChart.destroy(); // Destruye el gráfico anterior para evitar superposiciones
    }
    window.statsChart = new Chart(ctx, { // Crea un nuevo gráfico circular
        type: 'pie', // Tipo de gráfico: circular
        data: {
            labels: ['Usuarios Activos', 'Usuarios Bloqueados'], // Etiquetas del gráfico
            datasets: [{ // Conjunto de datos
                data: [activeUsers, blockedUsers], // Valores para cada categoría
                backgroundColor: ['#1abc9c', '#e74c3c'] // Colores para activo y bloqueado
            }]
        },
        options: { // Configuraciones del gráfico
            responsive: true, // Ajusta el tamaño al contenedor
            plugins: { // Configura plugins
                legend: { position: 'top' }, // Posiciona la leyenda en la parte superior
                title: { display: true, text: 'Distribución de Usuarios' } // Título del gráfico
            }
        }
    });

    // Actualiza la fecha de la última actualización
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); // Formato de fecha y hora
    document.getElementById('stats-date').textContent = `Última actualización: ${today} (-05)`; // Muestra la fecha con zona horaria
}

// ============================================================================
// INICIALIZACIÓN DEL DASHBOARD
// ============================================================================

// Función principal que inicializa el dashboard al cargar la página.
function initializeDashboard() {
    document.addEventListener('DOMContentLoaded', () => { // Ejecuta el código cuando el DOM esté completamente cargado
        const adminMenu = document.querySelector('.admin-menu'); // Obtiene el menú de administración
        const userNameDisplay = document.getElementById('user-name'); // Obtiene el elemento donde se muestra el nombre
        userNameDisplay.textContent = currentUser.nombre; // Actualiza el nombre del usuario en la interfaz
        document.getElementById('header-title').textContent = `Bienvenido, ${currentUser.nombre}`; // Actualiza el título de bienvenida

        // Muestra u oculta el menú de administración según el rol del usuario
        if (currentUser.rol === 'Admin') {
            adminMenu.style.display = 'block'; // Muestra el menú si es admin
        } else {
            adminMenu.style.display = 'none'; // Oculta el menú si no es admin
        }

        // Carga todas las secciones del dashboard
        loadDashboard(); // Carga las estadísticas del estudiante
        loadProgress(); // Carga el progreso del estudiante
        loadCourses(); // Carga los cursos inscritos
        loadUsers(); // Carga la tabla de usuarios
        loadAdminCourses(); // Carga la lista de cursos en admin
        loadStats(); // Carga las estadísticas y gráfico

        // Maneja el menú desplegable de navegación
        const dropdownToggle = document.querySelector('.dropdown-toggle'); // Obtiene el botón del menú
        const dropdown = document.querySelector('.dropdown'); // Obtiene el contenedor del menú
        if (dropdownToggle) { // Verifica que el botón exista
            dropdownToggle.addEventListener('click', () => { // Alterna la visibilidad del menú
                dropdown.classList.toggle('active');
            });
        }

        // Maneja la navegación entre secciones del dashboard
        const navLinks = document.querySelectorAll('.nav-link'); // Obtiene todos los enlaces de navegación
        const dashboardSections = document.querySelectorAll('.dashboard-section'); // Obtiene todas las secciones
        const adminSections = document.querySelectorAll('.admin-section'); // Obtiene secciones de admin
        const accessDenied = document.getElementById('access-denied'); // Obtiene el mensaje de acceso denegado
        const headerTitle = document.getElementById('header-title'); // Obtiene el título del encabezado

        navLinks.forEach(link => { // Itera sobre cada enlace de navegación
            link.addEventListener('click', (e) => { // Maneja el clic en cada enlace
                if (link.getAttribute('href') !== '#') return; // Ignora enlaces externos
                e.preventDefault(); // Previene el comportamiento por defecto del enlace
                const sectionId = link.getAttribute('data-section'); // Obtiene el ID de la sección objetivo
                navLinks.forEach(l => l.classList.remove('active')); // Quita la clase activa de todos los enlaces
                link.classList.add('active'); // Añade la clase activa al enlace clicado
                dashboardSections.forEach(section => section.style.display = 'none'); // Oculta todas las secciones
                adminSections.forEach(section => section.style.display = 'none'); // Oculta secciones de admin
                if (accessDenied) accessDenied.style.display = 'none'; // Oculta el mensaje de acceso denegado

                // Muestra la sección correspondiente según el enlace clicado
                if (sectionId === 'student-dashboard') {
                    document.getElementById('student-dashboard').style.display = 'block'; // Muestra el dashboard
                    headerTitle.textContent = `Bienvenido, ${currentUser.nombre}`; // Actualiza el título
                    loadDashboard(); // Recarga las estadísticas
                    loadProgress(); // Recarga el progreso
                } else if (sectionId === 'courses-section') {
                    document.getElementById('courses-section').style.display = 'block'; // Muestra los cursos
                    headerTitle.textContent = 'Cursos Disponibles'; // Actualiza el título
                    loadCourses(); // Recarga los cursos
                } else if (sectionId === 'progress-section') {
                    document.getElementById('progress-section').style.display = 'block'; // Muestra el progreso
                    headerTitle.textContent = 'Tu Progreso'; // Actualiza el título
                    loadProgress(); // Recarga el progreso
                } else if (sectionId.startsWith('admin-')) { // Maneja secciones de administración
                    if (currentUser.rol === 'Admin') { // Verifica si el usuario es admin
                        document.getElementById('admin-dashboard').style.display = 'block'; // Muestra el dashboard de admin
                        document.getElementById(sectionId).style.display = 'block'; // Muestra la subsección
                        headerTitle.textContent = sectionId === 'admin-users' ? 'Gestión de Usuarios' : // Actualiza título según sección
                                                 sectionId === 'admin-courses' ? 'Gestionar Cursos' :
                                                 'Estadísticas Generales';
                        if (sectionId === 'admin-users') loadUsers(); // Recarga usuarios
                        if (sectionId === 'admin-courses') loadAdminCourses(); // Recarga cursos de admin
                        if (sectionId === 'admin-stats') loadStats(); // Recarga estadísticas
                    } else { // Si no es admin, muestra acceso denegado
                        document.getElementById('admin-dashboard').style.display = 'block';
                        accessDenied.style.display = 'block';
                        headerTitle.textContent = 'Acceso Denegado';
                    }
                }
            });
        });

        // Maneja el cierre de sesión
        const logoutLink = document.getElementById('logout-link'); // Obtiene el enlace de cierre
        if (logoutLink) { // Verifica que el enlace exista
            logoutLink.addEventListener('click', (e) => { // Maneja el clic
                e.preventDefault(); // Previene el comportamiento por defecto
                localStorage.removeItem('currentUser'); // Elimina los datos del usuario del almacenamiento local
                window.location.href = 'login.html'; // Redirige a la página de login
            });
        }
    });
}

initializeDashboard(); // Llama a la función para iniciar el dashboard al cargar la página
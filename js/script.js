const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
let currentProduct = {};

if (slides.length > 0) {
    const showSlide = (index) => {
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === index;
            slide.classList.toggle('active', isActive);

            if (isActive) {
                slide.style.animation = 'none';
                void slide.offsetWidth;
                slide.style.animation = '';
            }
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    setInterval(nextSlide, 4500);
}

const categoryFilter = document.querySelector('#category-filter-select');

if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
        const sectionId = categoryFilter.value;
        if (!sectionId) return;

        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${sectionId}`);
    });
}

const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const productButtons = document.querySelectorAll('.product-more');
const productModal = document.querySelector('.product-modal');
const modalTitle = document.querySelector('.modal-title');
const modalImage = document.querySelector('.modal-image');
const modalClose = document.querySelector('.modal-close');
const modalDetails = document.querySelector('.product-summary');
const downloadPdfBtn = document.querySelector('#download-pdf');

// Datos de productos
const productData = {
    'Tator 12 EC': {
        ingredientes: 'Cipermetrina 10%, Tetrametrina 2%, Butóxido de piperonilo 15%',
        recomendacion: 'Cucarachas Alemanas (principalmente), Voladores (Moscas, Mosquitos), Rastreros (Hormigas, Chinches...), Plagas de Productos almacenados',
        dosis: '40 a 60 cc por galón de agua en aspersión\n60 cc/Gl. Nebulización\n200 cc/Gl. en Termo nebulización'
    },
    'BIOCIPER EW 25': {
        ingredientes: 'Cipermetrina 25%',
        recomendacion: 'Insectos rastreros y voladores',
        dosis: 'Consultar hoja técnica',
        beneficios: ['Acción rápida por contacto e ingestión.', 'Excelente efecto residual.', 'Formulación en emulsión acuosa (EW), con menor olor que formulaciones EC tradicionales.', 'Ideal para aplicaciones en interiores y exteriores.', 'Compatible con equipos de aspersión y nebulización.'],
        ingredienteActivo: 'Cipermetrina: 25% (250 g/L)',
        controla: ['Cucarachas', 'Mosquitos', 'Moscas', 'Chinches', 'Jejenes', 'Piojos', 'Otros insectos rastreros y voladores de importancia sanitaria.'],
        modoAccion: 'Actúa por contacto e ingestión, afectando el sistema nervioso de los insectos mediante la alteración de los canales de sodio, provocando parálisis y posteriormente la muerte.',
        metodosAplicacion: ['Aspersión manual.', 'Aspersión motorizada.', 'Nebulización ULV.', 'Tratamientos profesionales de control de plagas.'],
        dosisReferencia: ['20 mL en 5 L de agua para tratamientos preventivos sobre aproximadamente 100 m².', '40 mL en 5 L de agua para infestaciones severas.', 'En aplicaciones ULV, seguir las recomendaciones de la etiqueta del producto.'],
        reingreso: 'Se recomienda esperar 2 horas antes de reingresar al área tratada o hasta que las superficies estén completamente secas.',
        recomendaciones: 'Utilice siempre equipo de protección personal durante la preparación y aplicación. Evite el contacto con alimentos, personas y mascotas durante el tratamiento. Lea y siga las instrucciones de la etiqueta antes de usar el producto.'
    },
    'CYNOFF': {
        ingredientes: 'Cipermetrina 24.8%',
        recomendacion: 'Insecticida piretroide de uso profesional formulado para el control de una amplia variedad de insectos rastreros y voladores en aplicaciones interiores y exteriores.',
        dosis: 'Tratamiento normal: 10 mL por cada litro de agua.\nInfestaciones fuertes: 20 mL por cada litro de agua.\nRendimiento: Un litro de mezcla cubre aproximadamente 20 a 25 m², dependiendo del tipo de superficie y del equipo de aplicación.',
        ingredienteActivo: ['Cipermetrina 24.8%', 'Grupo IRAC: 3A (Piretroides).'],
        formulacion: ['EC (Emulsifiable Concentrate / Concentrado Emulsionable).', 'Se mezcla fácilmente con agua antes de la aplicación.'],
        modoAccion: 'Actúa por contacto e ingestión, alterando los canales de sodio del sistema nervioso del insecto, provocando parálisis y muerte en poco tiempo. Además, deja un residuo activo sobre las superficies tratadas que continúa controlando insectos durante semanas.',
        beneficios: ['Acción de choque.', 'Excelente efecto residual.', 'Ideal para infestaciones altas.', 'Aplicación en interiores y exteriores.', 'Muy eficaz contra cucarachas.', 'Bajo volumen de aplicación.', 'Uso profesional.'],
        controla: ['Cucarachas', 'Hormigas', 'Mosquitos', 'Moscas', 'Arañas', 'Grillos', 'Escarabajos', 'Lepismas (pececillos de plata)', 'Pulgas', 'Garrapatas', 'Milpiés', 'Ciempiés', 'Chinches y otros insectos rastreros y voladores.'],
        usosRecomendados: ['Viviendas', 'Apartamentos', 'Hoteles', 'Restaurantes', 'Hospitales', 'Escuelas', 'Oficinas', 'Industrias', 'Bodegas', 'Áreas perimetrales', 'Exteriores de edificios', 'Zonas comerciales.'],
        metodosAplicacion: ['Aplicar mediante aspersión de baja presión sobre zócalos, grietas, hendiduras, marcos de puertas, marcos de ventanas, debajo de fregaderos, debajo de muebles, áreas de tránsito de insectos y perímetros exteriores.'],
        tiempoAccion: ['Efecto inicial: pocos minutos después de la aplicación.', 'Máximo control: durante las primeras 24 horas.', 'Acción residual: varias semanas, dependiendo de la superficie y las condiciones ambientales.'],
        recomendaciones: ['Utilizar guantes, mascarilla y gafas de protección durante la preparación y aplicación.', 'Mantener alejados a niños y mascotas hasta que el producto se haya secado completamente.', 'No aplicar sobre alimentos ni utensilios de cocina.', 'Leer y seguir siempre las instrucciones de la etiqueta antes de usar el producto.']
    },
    'Garban': {
        ingredientes: 'Formula concentrada para control de insectos rastreros y voladores.',
        recomendacion: 'Insecticida profesional de amplio espectro para uso en interiores y exteriores.',
        dosis: 'Aplicar 20 mL por cada litro de agua para infestaciones normales. Ajustar según la presión de plaga y condiciones del sitio.',
        beneficios: ['Acción rápida contra insectos rastreros y voladores.', 'Buena residualidad en superficies tratadas.', 'Apto para aplicaciones en viviendas, comercios y áreas industriales.'],
        controla: ['Cucarachas', 'Hormigas', 'Moscas', 'Mosquitos', 'Arañas', 'Escarabajos', 'Otros insectos sanitarios.'],
        modoAccion: 'Actúa por contacto e ingestión, provocando paralisis y muerte rápida del insecto.',
        metodosAplicacion: ['Aspersión de baja presión sobre zócalos, grietas, hendiduras, marcos y perímetros.'],
        recomendaciones: ['Usar equipo de protección personal durante la preparación y aplicación.', 'Evitar contacto con alimentos y utensilios.', 'Mantener niños y mascotas fuera del área hasta el secado completo.']
    }
    ,
    'ZAPI KELTHOX 2.5 RB': {
        ingredientes: 'Ingrediente activo: Imidacloprid 2.15% p/p; Coformulantes: 97.85% p/p',
        recomendacion: 'Insecticida en gel para control localizado de cucarachas y otros insectos rastreros; aplicar en zonas de tránsito y refugio.',
        dosis: 'Aplicar pequeñas cantidades de gel según indicaciones de la etiqueta en grietas, rendijas y zonas de tránsito. Consultar etiqueta para número de puntos y frecuencia.',
        beneficios: ['Alta eficacia contra cucarachas y otros insectos rastreros.', 'Actúa por contacto e ingestión.', 'Formulación en gel para aplicación localizada y segura.', 'Acción prolongada y residual.', 'Ideal para uso profesional en programas de manejo de plagas urbanas.'],
        modoAccion: 'El Imidacloprid actúa sobre los receptores nicotínicos de acetilcolina en el sistema nervioso de los insectos, provocando una excitación continua que causa parálisis y muerte. Su formulación en gel permite una aplicación precisa y liberación controlada del ingrediente activo.',
        controla: ['Cucarachas (Blattella germanica, Periplaneta americana)', 'Hormigas', 'Otros insectos rastreros'],
        usosRecomendados: ['Viviendas y cocinas', 'Restaurantes y hoteles', 'Oficinas y bodegas', 'Instalaciones industriales y comerciales'],
        formulacion: 'RB – Gel insecticida',
        ingredienteActivo: 'Imidacloprid 2.15% p/p',
        recomendaciones: 'Producto de uso profesional. Mantener fuera del alcance de niños y animales domésticos. Evitar el contacto directo con piel y ojos. No aplicar sobre alimentos ni utensilios. Leer cuidadosamente la etiqueta antes de usar.'
    }
};

const technicalSheets = {
    'Tator 12 EC': 'tator-ficha.html',
    'BIOCIPER EW 25': 'biociper-ficha.html',
    'CYNOFF': 'cynoff-ficha.html',
    'Garban': 'garban-ficha.html',
    'Safrotin': 'safrotin-ficha.html',
    'ZAPI EKOSET 22 EC': 'ekoset-ficha.html',
    'ZAPI Broditop Bloque': 'broditop-ficha.html',
    'AGRORAT BD COMPLEX 0.25 SL': 'agrorat-ficha.html',
    'METERED INSECTICIDE SPRAY': 'metered-ficha.html',
    'Victor Power-Kill™ Rat Trap': 'trampa-raton-ficha.html',
    'Trampa Metálica para Roedores': 'trampa-metalica-ficha.html',
    'Cebadero Plástico para Roedores': 'cebadero-ficha.html',
    'Cebadero Tubular para Roedores': 'cebadero-tubular-ficha.html'
    ,
    'ZAPI IXIN KIDA IMIDACLOPRID 21.5 RB': 'zapi-ixin-ficha.html',
    'ZAPI KELTHOX 2.5 RB': 'zapi-kelthox-ficha.html'
};

if (productButtons.length > 0 && productModal) {
    productButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product || 'Producto';
            const productImage = button.dataset.image || '';
            const productDescription = button.dataset.description || '';
            
            // Guardar producto actual
            currentProduct = {
                nombre: productName,
                imagen: productImage,
                descripcion: productDescription
            };
            
            modalTitle.textContent = productName;
            if (productImage) {
                modalImage.style.backgroundImage = `url('${productImage}')`;
            } else {
                modalImage.style.backgroundImage = "linear-gradient(180deg, rgba(58,141,47,.2), rgba(20,48,27,.05))";
            }
            
            // Actualizar descripción si existe
            if (productDescription && modalDetails) {
                const detailsRow = modalDetails.querySelector('.summary-row:last-child .summary-value');
                if (detailsRow) {
                    detailsRow.textContent = productDescription;
                }
            }
            
            productModal.classList.add('active');
            productModal.setAttribute('aria-hidden', 'false');

            // Ocultar el botón 'Más información' para productos de la categoría EPP
            if (downloadPdfBtn) {
                const productItemEl = button.closest('.product-item');
                const tagEl = productItemEl ? productItemEl.querySelector('.product-tag') : null;
                const tagText = tagEl ? tagEl.textContent.trim() : '';
                if (tagText === 'EPP') {
                    downloadPdfBtn.style.display = 'none';
                } else {
                    downloadPdfBtn.style.display = '';
                }
            }
        });
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        productModal.classList.remove('active');
        productModal.setAttribute('aria-hidden', 'true');
    });
}

if (productModal) {
    productModal.addEventListener('click', (event) => {
        if (event.target === productModal || event.target.classList.contains('modal-backdrop')) {
            productModal.classList.remove('active');
            productModal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Descargar PDF del producto
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
        const productName = currentProduct.nombre || 'Producto';
        
        const technicalSheet = technicalSheets[productName];
        if (technicalSheet) {
            window.open(technicalSheet, '_blank');
            return;
        }
        
        const data = productData[productName];
        
        if (!data) return;
        
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Colores
        const colorDarkGreen = [11, 58, 34];
        const colorGreen = [42, 162, 74];
        const colorBlack = [0, 0, 0];
        
        // Función para agregar sección
        function addSection(title, content, yPos) {
            doc.setFontSize(14);
            doc.setTextColor(...colorDarkGreen);
            doc.text(title, 20, yPos);
            yPos += 7;
            
            doc.setFontSize(11);
            doc.setTextColor(...colorBlack);
            
            if (Array.isArray(content)) {
                content.forEach(item => {
                    const lines = doc.splitTextToSize('• ' + item, 170);
                    doc.text(lines, 20, yPos);
                    yPos += lines.length * 6;
                });
            } else {
                const lines = doc.splitTextToSize(content, 170);
                doc.text(lines, 20, yPos);
                yPos += lines.length * 6;
            }
            
            return yPos + 5;
        }
        
        // Título
        doc.setFontSize(28);
        doc.setTextColor(...colorDarkGreen);
        doc.text(productName, 105, 30, { align: 'center' });
        
        // Separador
        doc.setDrawColor(...colorGreen);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);
        
        let yPosition = 50;
        
        // Ingredientes
        doc.setFontSize(14);
        doc.setTextColor(...colorDarkGreen);
        doc.text('Ingredientes', 20, yPosition);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
        const ingredientesLines = doc.splitTextToSize(data.ingredientes, 170);
        doc.text(ingredientesLines, 20, yPosition);
        yPosition += ingredientesLines.length * 7 + 5;
        
        // Recomendación
        doc.setFontSize(14);
        doc.setTextColor(...colorDarkGreen);
        doc.text('Recomendación', 20, yPosition);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
        const recomendacionLines = doc.splitTextToSize(data.recomendacion, 170);
        doc.text(recomendacionLines, 20, yPosition);
        yPosition += recomendacionLines.length * 7 + 5;
        
        // Dosis
        doc.setFontSize(14);
        doc.setTextColor(...colorDarkGreen);
        doc.text('Dosis', 20, yPosition);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
        const dosisLines = doc.splitTextToSize(data.dosis, 170);
        doc.text(dosisLines, 20, yPosition);
        yPosition += dosisLines.length * 7 + 10;
        
        const additionalSections = [
            { key: 'formulacion', title: 'Formulación' },
            { key: 'beneficios', title: 'Beneficios' },
            { key: 'ingredienteActivo', title: 'Ingrediente activo' },
            { key: 'controla', title: 'Plagas que controla' },
            { key: 'usosRecomendados', title: 'Usos recomendados' },
            { key: 'modoAccion', title: 'Modo de acción' },
            { key: 'metodosAplicacion', title: 'Método de aplicación' },
            { key: 'tiempoAccion', title: 'Tiempo de acción' },
            { key: 'dosisReferencia', title: 'Dosis de referencia' },
            { key: 'reingreso', title: 'Reingreso' },
            { key: 'recomendaciones', title: 'Recomendaciones' }
        ];

        additionalSections.forEach(section => {
            if (!data[section.key]) return;
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            yPosition = addSection(section.title, data[section.key], yPosition);
        });
        
        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.line(20, 280, 190, 280);
        doc.setFontSize(9);
        doc.text('Documento generado por Kala Pest', 105, 285, { align: 'center' });
        doc.text('Para más información: kalapest@gmail.com', 105, 291, { align: 'center' });
        
        // Abrir en nueva ventana
        const pdfUrl = doc.output('bloburi');
        window.open(pdfUrl, '_blank');
    });
}

// Count-up animation for 'Años en la industria'
function animateYears(el){
    const end = parseInt(el.dataset.target || '0', 10);
    const duration = 1400;
    const start = 0;
    let startTime = null;

    function step(timestamp){
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        el.textContent = `+${value}`;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
    const yearsEl = document.querySelector('.years-value');
    if (!yearsEl) return;

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = yearsEl.closest('.quienes-stats');
                if (card) card.classList.add('visible');
                if (!yearsEl.dataset.animated) {
                    animateYears(yearsEl);
                    yearsEl.dataset.animated = 'true';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    io.observe(yearsEl);
});

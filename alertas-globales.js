// 1. Inyectar los estilos CSS de la notificación flotante
const alertStyles = document.createElement("style");
alertStyles.innerHTML = `
    #toast-container-global { position: fixed; top: 80px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .toast-alert { background: #fff; border-left: 4px solid #dc2626; border-radius: 10px; padding: 14px 18px; box-shadow: 0 8px 24px rgba(0,0,0,.12); display: flex; gap: 12px; align-items: flex-start; animation: toastIn .35s ease both; }
    .toast-alert.warning { border-left-color: #d97706; }
    @keyframes toastIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    .toast-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .toast-icon.danger { color: #dc2626; }
    .toast-icon.warning { color: #d97706; }
    .toast-title { font-size: 13px; font-weight: 700; color: #1a1a2e; }
    .toast-body { font-size: 12px; color: #555; margin-top: 2px; }
    .toast-close { margin-left: auto; background: none; border: none; color: #aaa; cursor: pointer; font-size: 16px; line-height: 1; }
`;
document.head.appendChild(alertStyles);

// 2. Inyectar el contenedor HTML para las alertas
const toastContainerGlobal = document.createElement("div");
toastContainerGlobal.id = "toast-container-global";
document.body.appendChild(toastContainerGlobal);

// 3. Función para dibujar la notificación en pantalla
function mostrarAlertaGlobal(title, body, type = "danger") {
    const toast = document.createElement("div");
    toast.className = `toast-alert ${type}`;
    toast.innerHTML = `
        <i class="toast-icon ${type} bi ${type === "danger" ? "bi-exclamation-triangle-fill" : "bi-exclamation-circle-fill"}"></i>
        <div>
            <div class="toast-title">${title}</div>
            <div class="toast-body">${body}</div>
        </div>
        <button class="toast-close" onclick="this.closest('.toast-alert').remove()">×</button>
    `;
    toastContainerGlobal.prepend(toast);
    setTimeout(() => toast.remove(), 8000); 
}

// 4. Lógica para procesar si los signos son peligrosos
async function procesarLecturaGlobal(record) {
    const { bpm, spo2, temperatura, paciente_id, fecha_registro } = record;
    const time = new Date(fecha_registro).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Validar que Supabase esté inicializado en la página
    if (typeof _supabase === "undefined") return;

    // Buscar nombre del paciente Y SUS RANGOS CONFIGURADOS
    // IMPORTANTE: Verifica que estos nombres de columnas coincidan con tu base de datos
    const { data: p } = await _supabase
        .from("pacientes")
        .select("nombre, apellido, bpm_min, bpm_max, spo2_min, temp_min, temp_max")
        .eq("id", paciente_id)
        .single();
        
    const name = p ? `${p.nombre} ${p.apellido}` : `Paciente ID ${paciente_id}`;

    // Extraer los rangos del paciente, usando valores por defecto por si alguno viene vacío/null
    const limitBpmMax = p?.bpm_max ?? 100;
    const limitBpmMin = p?.bpm_min ?? 60;
    const limitSpo2Min = p?.spo2_min ?? 90;
    const limitTempMax = p?.temp_max ?? 37.5;
    const limitTempMin = p?.temp_min ?? 36.0;

    // --- ALERTAS DE RITMO CARDÍACO ---
    if (bpm > limitBpmMax) {
        mostrarAlertaGlobal(
            `Ritmo cardíaco alto`,
            `${name} – ${bpm} BPM (Límite: ${limitBpmMax}) a las ${time}`,
            "danger"
        );
    } else if (bpm > 0 && bpm < limitBpmMin) {
        mostrarAlertaGlobal(
            `Ritmo cardíaco bajo`,
            `${name} – ${bpm} BPM (Límite: ${limitBpmMin}) a las ${time}`,
            "warning"
        );
    }

    // --- ALERTAS DE SpO2 ---
    if (spo2 > 0 && spo2 < limitSpo2Min) {
        mostrarAlertaGlobal(
            `SpO₂ crítico o bajo`,
            `${name} – ${spo2}% (Límite: ${limitSpo2Min}%) a las ${time}`,
            "danger" 
        );
    } else if (spo2 > 100) {
        mostrarAlertaGlobal(
            `SpO₂ elevado (Anormal)`,
            `${name} – ${spo2}% a las ${time}`,
            "warning"
        );
    }

    // --- ALERTAS DE TEMPERATURA ---
    if (temperatura > limitTempMax) {
        mostrarAlertaGlobal(
            `Temperatura alta`,
            `${name} – ${temperatura}°C (Límite: ${limitTempMax}°C) a las ${time}`,
            "danger"
        );
    } else if (temperatura > 0 && temperatura < limitTempMin) {
        mostrarAlertaGlobal(
            `Temperatura baja`,
            `${name} – ${temperatura}°C (Límite: ${limitTempMin}°C) a las ${time}`,
            "warning"
        );
    }
}

// 5. Conectarse al canal de Supabase (solo si NO estamos en Home, para no duplicar)
document.addEventListener("DOMContentLoaded", () => {
    if (
        !window.location.pathname.includes("Home.html") &&
        typeof _supabase !== "undefined"
    ) {
        _supabase
            .channel("global-alerts")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "signos_vitales" },
                (payload) => {
                    procesarLecturaGlobal(payload.new);
                }
            )
            .subscribe();
    }
});
## 📌 Descripción General

**VitalTrack** es un sistema de gestión médica centralizado basado en web que permite a los profesionales de la salud supervisar en tiempo real el estado clínico de los pacientes mediante dispositivos IoT (pulseras). El sistema procesa signos vitales, gestiona historiales clínicos y audita alertas críticas.

> 💡 Diseñado con una arquitectura *Serverless* (sin servidor tradicional) utilizando Supabase, priorizando la comunicación asíncrona en tiempo real y la visualización de datos estadísticos directamente desde el navegador.

### ✨ Características principales

- ⚡ **Tiempo Real**: Recepción de signos vitales (BPM, SpO2) mediante WebSockets  
- 📊 **Dashboard Médico**: Panel centralizado con métricas y alertas de pacientes activos  
- 🧑‍⚕️ **CRUD de Pacientes**: Gestión de usuarios, altas, bajas lógicas y actualización de datos  
- ⚙️ **Umbrales IoT**: Configuración de rangos médicos personalizados por paciente  
- 📈 **Estadísticas**: Cálculo automático de promedios históricos y desviación estándar  
- 🖨️ **Reportes**: Exportación de historiales y auditorías en formatos PDF y Excel  

---

## ⚙️ Tecnologías Utilizadas

<div align="center">
<img src="https://skillicons.dev/icons?i=supabase,postgres,js,html,css&theme=dark" height="65"/>
</div>

<br/>

- **Supabase** → Backend as a Service (BaaS), autenticación y WebSockets  
- **PostgreSQL** → Base de datos relacional en la nube  
- **JavaScript** → Lógica de negocio, cálculos y consumo del SDK  
- **HTML5** → Estructura de las interfaces  
- **CSS3** → Diseño responsivo y animaciones  
- **SheetJS (XLSX)** → Generación de reportes en Excel  

---

## 🧠 Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────┐
│               ARQUITECTURA CLIENTE - SERVERLESS             │
│                                                             │
│   ┌──────────┐    Supabase SDK    ┌─────────────────────┐   │
│   │ Web App  │ ─────────────────► │  Supabase (Cloud)   │   │
│   │ (JS/DOM) │ ◄───────────────── │ (Auth / PostgreSQL) │   │
│   └──────────┘  WSS (Realtime)    └─────────────────────┘   │
│        ▲                                 ▲                  │
│        │                                 │                  │
│        ▼                                 ▼                  │
│  ┌──────────┐                      ┌─────────────────────┐  │
│  │ Librerías│                      │   Hardware IoT      │  │
│  │ PDF/XLSX │                      │ (Sensores / ESP32)  │  │
│  └──────────┘                      └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Capas del sistema:**

- **Frontend** → Renderizado del DOM, eventos y lógica visual  
- **Integración (supabase-js)** → Manejo de CRUD y suscripciones en tiempo real  
- **Backend (Supabase)** → Base de datos, autenticación y reglas de seguridad  
- **Hardware (IoT)** → Captura de datos biométricos desde sensores  

---



## 📊 Módulos del Sistema

- 🔐 **Autenticación (Index.html)**  
  Validación de credenciales y control de acceso  

- 🎛️ **Dashboard (Home.html)**  
  Vista general con métricas del sistema  

- 👥 **Gestión de Pacientes (Usuarios.html)**  
  CRUD completo con monitoreo de estado  

- 🫀 **Signos y Rangos (MostrarSignos.html)**  
  Monitoreo en tiempo real y configuración de umbrales  

- 📑 **Estadísticas (Estadisticas.html)**  
  Reportes, cálculos y exportaciones  

---

## 📁 Estructura del Proyecto

```plaintext
vitaltrack-web/
│
├── assets/
├── css/
│
├── Index.html
├── Home.html
├── Usuarios.html
├── AgregarUsuario.html
├── ConfiguracionRangos.html
├── Estadisticas.html
├── Soporte.html
├── Auditoria.html
├── alertas-globales.js
├── EditarPaciente.html
├── Signos.html
├── MostrarSignos.html
├── Simulador.html
└── README.md
```

---

## 🧩 Características Técnicas

- ✅ WebSockets en tiempo real con `supabase.channel()`  
- ✅ Detección de sensores offline (timeout de 5 minutos)  
- ✅ Cálculos estadísticos en cliente (media y desviación estándar)  
- ✅ Exportación a Excel y PDF desde el navegador  
- ✅ Diseño responsive con Flexbox y CSS Grid  

---

## 📈 Mejoras Futuras

- 🔴 Seguridad con Row Level Security (RLS)  
- 🟠 Implementación como PWA  
- 🟠 Notificaciones push nativas  
- 🟡 Integración de IA para predicción clínica  

---

## 👥 Autor

**Universidad Tecnológica de Querétaro (UTEQ)**  
Ingeniería en Tecnologías de la Información e Innovación Digital  

- 👨‍💻 Juan Luis Cortes Matus  


---

<div align="center">
Transformando Vidas — VITALTRACK © 2026
</div>

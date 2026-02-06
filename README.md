# SecureBnB

## Descripción General
**SecureBnB** es una aplicación web académica para la gestión de alojamientos, actividades y servicios turísticos, desarrollada con un enfoque prioritario en **seguridad de la información**. El sistema sirve como plataforma de evaluación de controles de seguridad aplicados tanto a la aplicación como a la infraestructura que la soporta.

El proyecto simula un sistema tipo Airbnb, incorporando autenticación robusta, control de accesos, protección de datos sensibles y mecanismos de defensa a nivel de red y aplicación.

---

## Objetivo General
Desarrollar una aplicación web simple junto con su solución de seguridad, para ser evaluada en una etapa posterior.

## Objetivos Específicos
- Implementar una aplicación web utilizando las tecnologías definidas en el enunciado.
- Desplegar la aplicación en una infraestructura Linux con servicios de producción.
- Diseñar e implementar una arquitectura de seguridad para la aplicación y su infraestructura.
- Aplicar controles de seguridad a nivel de aplicación, red y sistema operativo.

---

## Stack Tecnológico

### Frontend
- React
- Vite
- JavaScript
- Comunicación segura mediante HTTPS

### Backend
- Node.js
- Express.js
- API REST con autenticación y autorización

### Base de Datos
- PostgreSQL
- Acceso mediante credenciales con privilegios mínimos
- Consultas parametrizadas para prevenir inyección SQL

### Infraestructura
- Sistema Operativo: Linux (derivado de RedHat)
- Servidor Web: Apache
- Web Application Firewall (WAF)
- Arquitectura: Máquina virtual Intel 64 bits

---

## Funcionalidades del Sistema

### 1. Autenticación y Gestión de Usuarios
- Login y logout
- Roles: Administrador y Usuario normal
- Autenticación de doble factor (2FA) mediante dispositivo de hardware
- Usuarios creados exclusivamente por el administrador directamente en la base de datos

### 2. Administración del Sistema (Rol Administrador)
- Aprobación o rechazo de alojamientos, actividades y servicios
- Consulta del listado de usuarios registrados

### 3. Registro de Alojamientos, Actividades y Servicios
- Propuesta de nuevos registros por usuarios y administradores
- Estados: pendiente, aprobado, rechazado
- Datos básicos: identificación, descripción, fechas y precio

### 4. Búsqueda y Reserva
- Visualización de propiedades aprobadas
- Reserva indicando fechas de entrada y salida

### 5. Gestión de Pago Simulado
- Confirmación de reserva mediante pago ficticio
- Tratamiento de los datos como información sensible
- Protección mediante cifrado y control de accesos

---

## Arquitectura de Seguridad

### Enfoque
Modelo de **defensa en profundidad**, aplicando controles en múltiples capas:
- Cliente
- Aplicación
- Servidor web
- Red
- Base de datos

### Componentes Protegidos
- Frontend React
- Backend Node.js
- Base de datos PostgreSQL
- Servidor Apache
- WAF
- Sistema operativo

---

## Objetivos de Seguridad
- Confidencialidad
- Integridad
- Autenticación
- Autorización
- No repudio
- Auditoría
- Privacidad

---

## Análisis de Riesgos (Resumen)

| Riesgo | Impacto | Mitigación |
|------|--------|-----------|
| Acceso no autorizado | Alto | Autenticación fuerte y RBAC |
| Inyección SQL | Alto | Consultas parametrizadas |
| Ataques web | Medio | WAF y validaciones |
| Fuga de datos | Alto | Cifrado y control de accesos |
| Fuerza bruta | Medio | Rate limiting |

---

## Controles de Seguridad Implementados
- Autenticación 2FA
- Hash seguro de contraseñas
- Control de acceso por roles
- Validación de entradas
- WAF
- HTTPS obligatorio
- Logs de auditoría
- Principio de mínimo privilegio

---

## Despliegue y Puesta en Producción
1. Instalación de Linux
2. Hardening del sistema
3. Configuración de Apache
4. Configuración del WAF
5. Instalación de Node.js
6. Build del frontend con Vite
7. Despliegue de frontend y backend
8. Configuración de PostgreSQL
9. Firewall y puertos
10. Pruebas funcionales y de seguridad

---

## Alcance de la Seguridad
- Información gestionada por la aplicación
- Frontend y backend
- Sistema operativo
- Base de datos
- Usuarios finales

> La seguridad física del hardware está limitada por la Nube Académica Computacional (NAC), considerando condiciones mínimas tipo SLA académico.

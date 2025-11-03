# Guía de Contribución al Proyecto: Sitio Airbnb Seguro

Para mantener un flujo de trabajo ordenado, seguro y coherente entre todos los desarrolladores, por favor sigue las siguientes pautas.

---

## 1. Reglas Generales

- No hacer `push` directo a la rama `main`.
- Todos los cambios deben pasar por un **Pull Request (PR)** desde una rama de trabajo.
- Antes de desarrollar una nueva tarea, revisa que haya un **issue asignado en el tablero Kanban**.
- Toda nueva funcionalidad debe incluir **validaciones de seguridad** y **pruebas básicas**.
- Está prohibido subir **credenciales, tokens o claves privadas** al repositorio.
- Cualquier cambio relacionado con seguridad debe tener revisión obligatoria por otro miembro del equipo.

---

## 2. Flujo de Trabajo en Git

1. **Actualizar la rama principal antes de trabajar**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Crear una nueva rama para tu tarea**
   ```bash
   git checkout -b feature/nombre-de-la-tarea
   ```
   Ejemplo:
   ```bash
   git checkout -b feature/autenticacion-2fa
   ```

3. **Realizar tus cambios y pruebas**
   - Asegúrate de no romper funcionalidades existentes.
   - Ejecuta validaciones de seguridad básicas (entradas, sesiones, cifrado).

4. **Hacer commit con una descripción clara**
   ```bash
   git add .
   git commit -m "feat(auth): implementar autenticación con doble factor"
   ```

5. **Subir tu rama y abrir un Pull Request**
   ```bash
   git push origin feature/autenticacion-2fa
   ```
   Luego crea un PR hacia `main` en GitHub, marcando si el cambio incluye temas de seguridad.

---

## 3. Convención de Nombres de Ramas

| Tipo de cambio | Prefijo | Ejemplo |
|----------------|----------|----------|
| Nueva funcionalidad | `feature/` | `feature/registro-usuarios` |
| Corrección de error | `fix/` | `fix/validacion-reservas` |
| Cambio de seguridad | `security/` | `security/cifrado-datos-sensibles` |
| Documentación | `docs/` | `docs/instalacion` |
| Refactorización | `refactor/` | `refactor/controlador-usuarios` |
| Tareas menores o mantenimiento | `chore/` | `chore/actualizar-dependencias` |

---

## 4. Convención de Commits

Usamos la convención **Conventional Commits** para mantener trazabilidad clara:

`<tipo>(módulo): descripción breve`

### Tipos de commit
| Tipo | Descripción |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `security` | Mejora o parche de seguridad |
| `docs` | Documentación o comentarios |
| `refactor` | Reorganización sin cambio de funcionalidad |
| `test` | Pruebas unitarias o de integración |
| `chore` | Mantenimiento o tareas menores |

**Ejemplos:**
```bash
feat(reservas): agregar verificación de fechas disponibles
fix(auth): corregir validación de sesión expirada
security(api): cifrar campos sensibles en la base de datos
docs(readme): agregar pasos de despliegue en NAC
refactor(admin): separar lógica de aprobación de servicios
```

---

## 5. Revisión de Código (Pull Requests)

Antes de abrir un PR:
- El código debe compilar y pasar las pruebas.
- No incluir `console.log` o código comentado innecesario.
- Confirmar que los cambios cumplen las **normas de seguridad**.
- Si el cambio afecta autenticación, datos sensibles o cifrado, agregar la etiqueta `security`.

**Formato recomendado del PR:**
```
### Descripción
Breve resumen del cambio realizado.

### Tipo de cambio
- [x] Nueva característica
- [ ] Corrección de bug
- [ ] Mejora de seguridad
- [ ] Documentación

### Pruebas realizadas
Indica las pruebas realizadas y sus resultados.

### Checklist
- [x] Validación de entradas implementada
- [x] Revisado por otro desarrollador
- [x] Cumple convención de commits
```

---

## 6. Buenas Prácticas Generales

- **Seguridad primero:**  
  Cualquier nuevo módulo debe incluir control de acceso, sanitización de entradas y manejo de errores.

- **Variables de entorno:**  
  Usa `.env` para credenciales, claves, tokens y rutas sensibles. No las subas al repositorio.

- **Pruebas:**  
  Asegúrate de incluir pruebas mínimas o manuales en cada nueva funcionalidad.

- **Documentación:**  
  Si creas o cambias endpoints, rutas o parámetros, documenta esos cambios en `docs/` o en el README correspondiente.

- **Comunicación:**  
  Coordina tareas en el tablero de GitHub (Kanban). Cada issue debe tener un responsable asignado.

---

## 7. Errores Comunes a Evitar

- Hacer commits o merges directamente en `main`.
- Subir dependencias pesadas o archivos de entorno.
- Dejar logs, tokens o contraseñas en el código.
- Omitir validaciones de usuario o roles.
- No especificar tipo de commit o nombre de rama correcto.

---

## 8. Política de Seguridad

1. Cualquier vulnerabilidad detectada debe reportarse mediante un issue con la etiqueta `security`.
2. No se deben divulgar detalles técnicos de la vulnerabilidad en público hasta su resolución.
3. Las dependencias externas deben mantenerse actualizadas.
4. Se debe ejecutar una revisión de seguridad antes de cada entrega o despliegue.

---

**Gracias por contribuir de manera segura y responsable al proyecto.**

# SideProjectAPM - APM para Side Projects

## Visión
Un APM ligero y self-hosted diseñado para indie hackers que necesitan observability real sin el coste ni la complejidad de soluciones enterprise como Datadog o New Relic.

## Target
Indie hackers y desarrolladores con múltiples side projects que quieren:
- Monitorear salud de sus apps sin complejidad
- Pagar $0-5/mes, no $100+
- Self-hostear en su propio infra
- Métricas que importan: errores, latencia, uptime

## User Stories

### US-001: Dashboard de Overview
**Como** indie hacker con varios side projects
**Quiero** ver un dashboard con el estado de todos mis proyectos en un vistazo
**Para** saber rápidamente si algo va mal sin revisar cada uno

**Criterios de aceptación:**
- [ ] Dashboard muestra lista de proyectos registrados
- [ ] Cada proyecto muestra: status (healthy/degraded/down), uptime %, error rate
- [ ] Ordenado por prioridad (más problemas primero)
- [ ] Click en proyecto lleva a detalle

**Prioridad:** Must
**Esfuerzo:** M

### US-002: Registro de Proyecto
**Como** desarrollador
**Quiero** registrar un nuevo proyecto con un simple API key
**Para** empezar a recibir métricas en menos de 1 minuto

**Criterios de aceptación:**
- [ ] Form para crear proyecto (nombre, URL, descripción)
- [ ] Genera API key único
- [ ] Muestra instrucciones de integración (snippet JS/Python/Go)
- [ ] API key visible solo una vez (seguridad)

**Prioridad:** Must
**Esfuerzo:** S

### US-003: Recepción de Métricas
**Como** aplicación monitoreada
**Quiero** enviar métricas via HTTP POST simple
**Para** reportar mi estado sin SDKs complejos

**Criterios de aceptación:**
- [ ] Endpoint: POST /api/v1/metrics
- [ ] Acepta JSON con: timestamp, metric_type, value, tags
- [ ] Auth via header: X-API-Key
- [ ] Respuesta 202 Accepted asíncrona
- [ ] Rate limiting por API key (1000 req/min)

**Prioridad:** Must
**Esfuerzo:** M

### US-004: Alertas de Errores
**Como** desarrollador
**Quiero** recibir alertas cuando mi proyecto tiene errores
**Para** poder actuar antes de que usuarios se quejen

**Criterios de aceptación:**
- [ ] Configurar umbral de error rate por proyecto
- [ ] Canales de notificación: email, webhook
- [ ] Cooldown entre alertas (evitar spam)
- [ ] Muestra últimos 10 errores en dashboard

**Prioridad:** Should
**Esfuerzo:** M

### US-005: Latency Distribution
**Como** desarrollador
**Quiero** ver la distribución de latencia de mis endpoints
**Para** identificar cuellos de botella

**Criterios de aceptación:**
- [ ] Histograma P50/P95/P99 de latencia
- [ ] Filtro por endpoint/tags
- [ ] Timeline de últimos 24h
- [ ] Comparación con período anterior

**Prioridad:** Should
**Esfuerzo:** L

### US-006: Uptime Monitoring
**Como** desarrollador
**Quiero** monitorear uptime de mis endpoints vía ping
**Para** saber si mi servicio está accesible

**Criterios de aceptación:**
- [ ] Configurar URLs a monitorear
- [ ] Ping configurable (1/5/15 min)
- [ ] Historial de 30 días
- [ ] Incidentes registrados con duración

**Prioridad:** Must
**Esfuerzo:** M

### US-007: Error Tracking
**Como** desarrollador
**Quiero** ver errores agrupados con stack traces
**Para** debuggear eficientemente

**Criterios de aceptación:**
- [ ] Errores agrupados por fingerprint (tipo + mensaje)
- [ ] Stack trace completo
- [ ] Tags contextuales (browser, OS, user_id)
- [ ] Marcar como resuelto/ignorado

**Prioridad:** Should
**Esfuerzo:** L

### US-008: Self-hosted First
**Como** usuario de homelab
**Quiero** desplegar con un solo comando Docker
**Para** tener APM corriendo en 5 minutos

**Criterios de aceptación:**
- [ ] Docker compose con todos los servicios
- [ ] Variables de entorno documentadas
- [ ] Persistencia con volúmenes
- [ ] Health check endpoint

**Prioridad:** Must
**Esfuerzo:** M

## Tareas Técnicas

| ID | Tarea | Depende de | Esfuerzo | Prioridad |
|----|-------|------------|----------|-----------|
| T1 | Setup proyecto Next.js 14 + TypeScript + Tailwind | - | S | Must |
| T2 | Estructura de proyecto (dirs, config base) | T1 | S | Must |
| T3 | Database schema (PostgreSQL/SQLite) | T2 | S | Must |
| T4 | API: Crear proyecto + generar API key | T3 | S | Must |
| T5 | API: POST /metrics (recepción) | T3, T4 | M | Must |
| T6 | Dashboard: Lista de proyectos | T4 | M | Must |
| T7 | Dashboard: Detalle de proyecto | T5, T6 | M | Must |
| T8 | Uptime checker (background job) | T5 | M | Must |
| T9 | Docker compose + env config | T1-T8 | M | Must |
| T10 | Error tracking + grouping | T5 | L | Should |
| T11 | Latency histograms (P50/P95/P99) | T5 | L | Should |
| T12 | Alertas (email + webhook) | T5, T8 | M | Should |
| T13 | Auth básica (login simple) | T4 | S | Could |
| T14 | Multi-usuario (teams) | T13 | M | Could |
| T15 | SDKs cliente (JS/Python/Go) | T5 | L | Could |

## MVP Scope

### Incluye (v0.1)
- Registro de proyectos con API key
- Recepción de métricas (custom metrics + uptime pings)
- Dashboard básico con lista y detalle
- Uptime monitoring automático
- Docker compose para self-hosting
- Sin auth (single-user, MVP para uso personal)

### Futuras iteraciones
- Error tracking con stack traces
- Latency distribution/histograms
- Alertas por email/webhook
- Multi-usuario/teams
- SDKs oficiales

## Stack Propuesto
- **Frontend:** Next.js 14, React, Tailwind CSS, Recharts
- **Backend:** Next.js API Routes (o Express separado si escala)
- **Database:** SQLite (simplicity first) → PostgreSQL si necesario
- **Background Jobs:** node-cron o BullMQ
- **Deploy:** Docker + Proxmox CT con PM2
# UX Flows - SideProjectAPM

## Mapa de navegación

```
/ (Landing → redirect a /dashboard si ya hay proyectos)
├── /dashboard
│   ├── /dashboard/create (nuevo proyecto)
│   └── /dashboard/[projectId]
│       ├── Overview (tab default)
│       ├── Metrics (tab)
│       ├── Uptime (tab)
│       └── Settings (tab)
└── /setup (primer uso - crear primer proyecto)
```

## User Flow 1: Onboarding (Primer Proyecto)

### Descripción
Usuario nuevo llega a la app sin proyectos. Debe crear su primer proyecto para empezar a monitorear.

### Pasos
1. Usuario accede a `/` → detecta no hay proyectos
2. Sistema redirige a `/setup`
3. Usuario ve explicación del producto + CTA "Crear primer proyecto"
4. Usuario hace click → navega a `/dashboard/create`
5. Usuario completa formulario (nombre, URL, descripción opcional)
6. Usuario submit → sistema genera API key
7. Sistema muestra API key UNA vez + instrucciones de integración
8. Usuario copia API key → confirma
9. Sistema redirige a `/dashboard/[projectId]` con estado "waiting for data"

### Pantalla: Setup (Primer uso)

**URL:** /setup
**Propósito:** Onboarding de usuarios nuevos sin proyectos

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo "SideProjectAPM" (minimal)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│           ┌─────────────────────────────┐               │
│           │                             │               │
│           │    🎯 Monitor Your Side     │               │
│           │       Projects              │               │
│           │                             │               │
│           │    Simple APM for indie     │               │
│           │    hackers. $0/month.       │               │
│           │                             │               │
│           │    [Create Your First       │               │
│           │     Project →]              │               │
│           │                             │               │
│           └─────────────────────────────┘               │
│                                                         │
│                                                         │
│    Features:                                            │
│    ✓ Uptime monitoring       ✓ Custom metrics           │
│    ✓ Error tracking          ✓ Self-hosted              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Estados:**
- Solo tiene estado "empty" (es la pantalla inicial)

**Interacciones:**
- Click en "Create Your First Project" → `/dashboard/create`

---

## User Flow 2: Crear Nuevo Proyecto

### Descripción
Usuario registrado quiere añadir un nuevo side project al APM.

### Pasos
1. Usuario en `/dashboard` → click botón "+" o "New Project"
2. Navega a `/dashboard/create`
3. Usuario completa formulario
4. Submit → sistema valida → genera API key
5. Sistema muestra modal/página con API key + instrucciones
6. Usuario confirma que copió → cierra modal
7. Sistema redirige al dashboard del nuevo proyecto

### Pantalla: Create Project

**URL:** /dashboard/create
**Propósito:** Registrar un nuevo proyecto en el APM

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + [Dashboard] + [New Project] (active)     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   < Back to Dashboard                                   │
│                                                         │
│   Create New Project                                    │
│   ─────────────────────                                 │
│                                                         │
│   Project Name *                                        │
│   ┌─────────────────────────────────────────────┐      │
│   │ My Awesome Side Project                      │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
│   Website URL *                                         │
│   ┌─────────────────────────────────────────────┐      │
│   │ https://myproject.com                        │      │
│   └─────────────────────────────────────────────┘      │
│   Used for uptime monitoring                            │
│                                                         │
│   Description (optional)                                │
│   ┌─────────────────────────────────────────────┐      │
│   │ A brief description...                       │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
│   ┌─────────────────────────────────────────────┐      │
│   │         Create Project                        │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Estados:**
- **Default:** Formulario vacío
- **Validating:** Spinner en botón mientras valida URL
- **Error:** Mensajes inline bajo campos inválidos
- **Success:** Redirige a pantalla de API key

### Pantalla: API Key Generated (Modal/Página)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    🎉 Project Created!                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Your API Key (copy now - won't show again):          │
│                                                         │
│   ┌─────────────────────────────────────────────┐      │
│   │ sk_live_abc123def456...            [Copy]    │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
│   ─────────────────────────────────────────────────     │
│                                                         │
│   Quick Integration:                                    │
│                                                         │
│   // Send a metric                                      │
│   fetch('https://apm.example.com/api/v1/metrics', {     │
│     method: 'POST',                                     │
│     headers: {                                          │
│       'Content-Type': 'application/json',              │
│       'X-API-Key': 'sk_live_abc123...'                 │
│     },                                                  │
│     body: JSON.stringify({                              │
│       type: 'counter',                                  │
│       name: 'page_views',                               │
│       value: 1                                          │
│     })                                                  │
│   });                                                   │
│                                                         │
│   ─────────────────────────────────────────────────     │
│                                                         │
│   [ ] I've copied my API key                           │
│                                                         │
│   ┌─────────────────────────────────────────────┐      │
│   │      Go to Dashboard                         │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Interacciones:**
- Click en [Copy] → Copia API key al clipboard → muestra "Copied!"
- Checkbox debe estar checked para habilitar "Go to Dashboard"
- Click en "Go to Dashboard" → `/dashboard/[projectId]`

---

## User Flow 3: Dashboard Principal

### Descripción
Usuario ve el estado de todos sus proyectos de un vistazo.

### Pasos
1. Usuario accede a `/dashboard`
2. Sistema carga lista de proyectos
3. Usuario ve cards con estado de cada proyecto
4. Usuario puede click en proyecto → detalle
5. Usuario puede click en "+" → crear nuevo

### Pantalla: Dashboard

**URL:** /dashboard
**Propósito:** Overview de todos los proyectos

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + [Dashboard (active)] + [New Project]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   My Projects (3)                    [+ New Project]     │
│                                                         │
│   ┌─────────────────┐ ┌─────────────────┐               │
│   │ 🟢 Midwiser     │ │ 🟡 DiffScan     │               │
│   │                 │ │                 │               │
│   │ Uptime: 99.9%   │ │ Uptime: 98.2%   │               │
│   │ Errors: 2/day   │ │ Errors: 15/day  │               │
│   │ Latency: 120ms  │ │ Latency: 340ms  │               │
│   │                 │ │                 │               │
│   │ Last 24h ▶     │ │ Last 24h ▶      │               │
│   └─────────────────┘ └─────────────────┘               │
│                                                         │
│   ┌─────────────────┐                                   │
│   │ 🔴 VoltAssistant│                                   │
│   │                 │                                   │
│   │ Uptime: 85.3%   │ ⚠️ 3 incidents                    │
│   │ Errors: 45/day  │                                   │
│   │ Latency: 890ms  │                                   │
│   │                 │                                   │
│   │ Last 24h ▶     │                                   │
│   └─────────────────┘                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Estados:**
- **Loading:** 3 skeleton cards con animación pulse
- **Empty:** "No projects yet" + CTA "Create your first project"
- **Error:** "Failed to load projects" + Retry button
- **Success:** Grid de cards como arriba

**Estados de Card:**
- 🟢 Healthy: Uptime > 99%, Errors < 10/day, Latency < 300ms
- 🟡 Degraded: Uptime 95-99%, Errors 10-50/day, Latency 300-500ms
- 🔴 Down/Critical: Uptime < 95%, Errors > 50/day, Latency > 500ms

**Interacciones:**
- Click en card → `/dashboard/[projectId]`
- Click en "+ New Project" → `/dashboard/create`
- Cards ordenadas por severidad (critical primero)

---

## User Flow 4: Detalle de Proyecto

### Descripción
Usuario profundiza en las métricas de un proyecto específico.

### Pantalla: Project Detail - Overview Tab

**URL:** /dashboard/[projectId]
**Propósito:** Ver detalles del proyecto

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + [Dashboard] + [New Project]              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   < Back to Dashboard                                   │
│                                                         │
│   Midwiser                              [Edit] [Delete] │
│   https://midwiser.app                                  │
│   Status: 🟢 Healthy                                    │
│                                                         │
│   [Overview] [Metrics] [Uptime] [Settings]              │
│   ─────────────────────────────────────────────────────│
│                                                         │
│   ┌──────────────────────┐ ┌──────────────────────┐     │
│   │ Uptime               │ │ Errors               │     │
│   │                      │ │                      │     │
│   │   99.9%              │ │    2/day             │     │
│   │   ▲ 0.2%            │ │   ▼ 5 from yesterday  │     │
│   └──────────────────────┘ └──────────────────────┘     │
│                                                         │
│   ┌──────────────────────┐ ┌──────────────────────┐     │
│   │ Avg Latency          │ │ Requests             │     │
│   │                      │ │                      │     │
│   │   120ms              │ │   1,234/hr           │     │
│   │   P95: 180ms         │ │   ▲ 12%             │     │
│   └──────────────────────┘ └──────────────────────┘     │
│                                                         │
│   Recent Activity (Last 24h)                            │
│   ─────────────────────────────────────────────────────│
│   ┌─────────────────────────────────────────────────┐  │
│   │  ████████████████████████████████████████████   │  │
│   │  ↑ Requests over time (sparkline)               │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   Last 5 Errors                                         │
│   ─────────────────────────────────────────────────────│
│   • 14:32 - TypeError: Cannot read... (3x)             │
│   • 12:05 - 500 Internal Server Error (1x)             │
│   • 08:12 - Timeout: Request exceeded... (2x)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Tabs:**
1. **Overview:** KPIs + sparklines + recent errors
2. **Metrics:** Custom metrics enviadas por la app
3. **Uptime:** Historial de pings + incidentes
4. **Settings:** Configurar proyecto, regenerar API key

### Pantalla: Uptime Tab

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│   [Overview] [Metrics] [Uptime (active)] [Settings]     │
│   ─────────────────────────────────────────────────────│
│                                                         │
│   Uptime: 99.9% (Last 30 days)                          │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │  Calendar view (green/yellow/red days)          │   │
│   │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░▓░░                │   │
│   │  (green = healthy, red = down, yellow = issues) │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Incidents (1)                                         │
│   ─────────────────────────────────────────────────────│
│   Apr 28, 2026 - 14:32 to 14:45 (13 min)               │
│   Cause: Server timeout                                 │
│   Resolved automatically                                │
│                                                         │
│   Response Times (Last 24h)                             │
│   ─────────────────────────────────────────────────────│
│   ┌─────────────────────────────────────────────────┐   │
│   │  ~~~ line chart ~~~                             │   │
│   │  Avg: 120ms | Min: 80ms | Max: 450ms            │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Flow 5: Enviar Métricas (API)

### Descripción
El sistema recibe métricas de aplicaciones monitoreadas.

### Endpoint

**POST /api/v1/metrics**

**Headers:**
- `X-API-Key: sk_live_...` (required)
- `Content-Type: application/json`

**Body:**
```json
{
  "type": "counter|gauge|histogram",
  "name": "page_views",
  "value": 1,
  "tags": {
    "page": "/dashboard",
    "browser": "chrome"
  },
  "timestamp": "2026-05-01T00:00:00Z"
}
```

**Response:**
- 202 Accepted: Métrica recibida
- 401 Unauthorized: API key inválida
- 429 Too Many Requests: Rate limit excedido

**Rate Limits:**
- 1000 requests/min per API key
- Burst: 100 requests

---

## Consideraciones de Accesibilidad

1. **Navegación por teclado:**
   - Tab order lógico
   - Focus visible en todos los elementos interactivos
   - Skip links para navegación principal

2. **Contraste:**
   - Mínimo 4.5:1 para texto
   - Status indicators (🟢🟡🔴) con texto alternativo
   - No depender solo del color para convey information

3. **Formularios:**
   - Labels asociados con inputs
   - Error messages linked via aria-describedby
   - Required fields marcados con *

4. **Screen readers:**
   - Alt text en gráficos (descripción textual)
   - ARIA labels en botones icon-only
   - Live regions para actualizaciones de status

5. **Responsive:**
   - Mobile-first design
   - Cards apilan en móvil
   - Tab navigation scrollable en móvil
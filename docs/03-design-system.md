# Design System - SideProjectAPM

## Concepto Visual

**Vibe:** Clean, technical, developer-friendly. Inspirado en:
- Vercel dashboard (minimal, dark-friendly)
- Linear app (smooth, modern)
- Grafana (data-focused pero más limpio)

## Paleta de colores

### Tema Claro (Default)

#### Primarios
- **Primary:** #6366F1 (Indigo) - CTAs, enlaces activos, acentos
- **Primary Hover:** #4F46E5
- **Primary Light:** #E0E7FF (backgrounds sutiles)
- **Primary Dark:** #3730A3

#### Neutrales
- **Background:** #FAFAFA (gris muy claro)
- **Surface:** #FFFFFF (cards, modals)
- **Border:** #E5E7EB
- **Border Focus:** #C7D2FE (primary light)

#### Texto
- **Text Primary:** #111827 (casi negro)
- **Text Secondary:** #6B7280 (gris medio)
- **Text Tertiary:** #9CA3AF (gris claro para hints)
- **Text Inverse:** #FFFFFF (sobre fondos oscuros)

### Tema Oscuro (Preparado)

- **Background Dark:** #0F0F0F
- **Surface Dark:** #1A1A1A
- **Border Dark:** #2A2A2A
- **Text Primary Dark:** #F9FAFB
- **Text Secondary Dark:** #9CA3AF

### Semánticos

| Uso | Claro | Oscuro | Hex |
|-----|-------|--------|-----|
| **Success** | #10B981 | #34D399 | Green-500/400 |
| **Error** | #EF4444 | #F87171 | Red-500/400 |
| **Warning** | #F59E0B | #FBBF24 | Amber-500/400 |
| **Info** | #3B82F6 | #60A5FA | Blue-500/400 |

### Status del Proyecto

- **Healthy:** #10B981 (verde)
- **Degraded:** #F59E0B (amber)
- **Critical/Down:** #EF4444 (rojo)

---

## Tipografía

**Font Family:** Inter (Google Fonts)
- Alternativa: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Monospace: JetBrains Mono (para código/API keys)

### Escala Tipográfica

| Nivel | Tamaño | Line Height | Peso | Letter Spacing | Uso |
|-------|--------|-------------|------|----------------|-----|
| **Display** | 3rem (48px) | 1.1 | 700 | -0.02em | Hero headlines |
| **H1** | 2.25rem (36px) | 1.2 | 700 | -0.01em | Títulos de página |
| **H2** | 1.5rem (24px) | 1.3 | 600 | 0 | Secciones |
| **H3** | 1.25rem (20px) | 1.4 | 600 | 0 | Subsecciones, cards |
| **H4** | 1rem (16px) | 1.5 | 600 | 0 | Card titles, tabs |
| **Body** | 1rem (16px) | 1.6 | 400 | 0 | Texto general |
| **Body Small** | 0.875rem (14px) | 1.5 | 400 | 0 | Texto secundario |
| **Caption** | 0.75rem (12px) | 1.4 | 500 | 0.01em | Labels, badges |
| **Code** | 0.875rem (14px) | 1.5 | 400 | 0 | Monospace para código |

---

## Espaciado

**Base:** 4px (0.25rem)

| Token | Valor | Uso |
|-------|-------|-----|
| **space-xs** | 4px | Icon padding, tight gaps |
| **space-sm** | 8px | Button padding vertical, small gaps |
| **space-md** | 16px | Card padding, standard gaps |
| **space-lg** | 24px | Section padding, larger gaps |
| **space-xl** | 32px | Page sections |
| **space-2xl** | 48px | Major sections |
| **space-3xl** | 64px | Hero spacing |

---

## Componentes Base

### Button
- Primary: bg-indigo-600, hover:bg-indigo-700
- Secondary: border border-gray-300, hover:bg-gray-50
- Ghost: transparent, hover:bg-gray-100

### Input
- border border-gray-300, focus:ring-2 focus:ring-indigo-500

### Card
- bg-white rounded-xl border border-gray-200 shadow-sm

---

## Iconos
- Librería: Lucide React
- Tamaño default: 20px
- Stroke width: 2
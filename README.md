# Prueba técnica Full-Stack — Cobrix

Queremos observar cómo entiendes y reparas un sistema pequeño que atraviesa varias capas. El objetivo visible es lograr que una petición termine encendiendo el bombillo de la interfaz.

## Contexto

El repositorio contiene:

- Una interfaz en React.
- Una API en NestJS.
- Comunicación en tiempo real mediante WebSocket.
- Un proveedor externo simulado y local.
- Un entorno basado en Docker Compose.

El proyecto contiene fallas intencionales. Encontrarlas y explicar su causa forma parte de la prueba.

## Objetivo

Debes conseguir y verificar este flujo:

```text
interfaz -> API -> proveedor simulado -> WebSocket -> bombillo encendido
```

Una respuesta HTTP exitosa por sí sola no completa el reto. La interfaz debe recibir el evento correspondiente y mostrar el bombillo encendido.

## Condiciones

- Tiempo esperado de trabajo efectivo: 2–3 horas.
- Ventana de entrega: 48 horas desde que recibes acceso.
- Puedes usar IA, documentación, buscadores y las herramientas que normalmente utilizarías en tu trabajo.
- No evaluamos memoria ni velocidad escribiendo código. Evaluamos investigación, criterio, verificación y comunicación.
- No es obligatorio completar todo para obtener una buena evaluación. Documenta con claridad lo que encontraste y qué harías después.

## Inicio

Requisitos: Docker y Docker Compose. Node.js 22+ y pnpm 10+ son recomendados para ejecutar las verificaciones fuera de los contenedores.

```bash
cp .env.example .env
docker compose up --build
```

La interfaz debe estar disponible en `http://localhost:4173` y la API en `http://localhost:4000` cuando sus servicios estén saludables.

Comandos útiles:

```bash
docker compose ps
docker compose logs
pnpm install
pnpm test
pnpm typecheck
pnpm build
pnpm smoke
```

## Entrega

1. Trabaja en una rama propia.
2. Realiza commits que permitan seguir tu razonamiento.
3. Completa `DECISIONS.md`.
4. Abre un pull request hacia `main` con un resumen y evidencia de verificación.

No incluyas secretos, información de empleadores anteriores ni datos personales innecesarios.

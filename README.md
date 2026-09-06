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
- El pull request final debe contener la solución completa y funcional. Si encuentras un bloqueo durante el trabajo, documéntalo, pero no marques la entrega como terminada hasta completar y verificar todo el flujo.

## Paso a paso

Requisitos: Docker y Docker Compose. Node.js 22+ y pnpm 10+ son recomendados para ejecutar las verificaciones fuera de los contenedores.

1. Acepta la invitación al repositorio privado asignado por Cobrix. Aunque existe una plantilla pública, trabaja y entrega únicamente en el repositorio privado que recibiste; no hagas un fork público.
2. Clona el repositorio privado y crea una rama propia, por ejemplo `solution/tu-usuario-github`.
3. Prepara el entorno y levanta los servicios:

```bash
cp .env.example .env
docker compose up --build
```

4. Abre `http://localhost:4173`, reproduce el problema e investiga el código, el estado de los contenedores y los logs.
5. Repara el flujo completo sin sustituirlo por valores fijos en la interfaz.
6. Ejecuta las verificaciones:

```bash
docker compose ps
docker compose logs
pnpm install
pnpm format:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm smoke
```

7. Completa `DECISIONS.md` con el diagnóstico, las decisiones tomadas, el uso de herramientas o IA y la evidencia de verificación.
8. Haz commits claros, sube tu rama y abre un pull request hacia `main`.

## Criterios de finalización

El pull request está listo para entregar cuando:

- Los tres servicios están saludables en Docker Compose.
- La interfaz muestra la API disponible, el WebSocket conectado y el bombillo encendido después de ejecutar la operación.
- La respuesta HTTP y el evento WebSocket corresponden al mismo identificador de operación.
- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` y `pnpm smoke` terminan correctamente.
- `DECISIONS.md` está completo y el pull request incluye un resumen y la evidencia de las verificaciones.

## Entrega

La entrega es el pull request abierto hacia `main` dentro del repositorio privado asignado. Debe representar la solución terminada; un borrador o una rama con el flujo incompleto no cuenta como entrega final.

No incluyas secretos, información de empleadores anteriores ni datos personales innecesarios.

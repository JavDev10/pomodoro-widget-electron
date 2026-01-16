# Pomodoro Widget

Un widget de Pomodoro simple y elegante construido con Electron. Diseñado para flotar en tu escritorio y ayudarte a gestionar tus sesiones de enfoque y descanso.

## Características

- **Temporizadores Configurables**: Ajusta el tiempo de Foco (Focus) y Descanso (Break) en incrementos de 5 minutos.
- **Modo Bucle (Loop)**: Configura ciclos automáticos de Foco/Descanso (x1, x2, x4).
- **Interfaz Flotante**: Ventana transparente y minimalista.
- **Vistas Distintas**: Pantallas dedicadas para Configuración, Foco y Descanso.

## Pre-requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión recomendada: v20 o superior)
- [pnpm](https://pnpm.io/) (Gestor de paquetes)

## Instalación

1.  **Clonar el repositorio** (o descargar los archivos):

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd pomodoro-widget
    ```

2.  **Instalar dependencias**:

    Este proyecto utiliza `pnpm` para gestionar las dependencias.

    ```bash
    pnpm install
    ```

    > **Nota:** Si encuentras errores durante la instalación de Electron, intenta ejecutar:
    > `node node_modules/electron/install.js` después de instalar.

## Ejecución

Para iniciar la aplicación en modo de desarrollo:

```bash
pnpm start
```

## Estructura del Proyecto

- `main.js`: Punto de entrada del proceso principal de Electron.
- `renderer.js`: Lógica del frontend y manejo del temporizador.
- `index.html`: Estructura HTML de la interfaz.
- `style.css`: Estilos de la aplicación.

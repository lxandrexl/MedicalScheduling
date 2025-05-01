
# 🩺 MedicalScheduling API

### ✨ Proyecto de Backend para Gestión de Citas Médicas

¡Hola! 👋 Soy Joshua, y te presento **MedicalScheduling**, una API backend diseñada para facilitar la gestión de citas médicas. Este proyecto refleja mi pasión por crear soluciones tecnológicas que aborden necesidades reales.

---

### 🚀 Características Principales

- **API RESTful** desarrollada con Node.js y AWS Lambda.
- **Infraestructura como código** utilizando Serverless Framework.
- **Documentación interactiva** con Swagger UI.
- **Despliegue en AWS API Gateway**, asegurando escalabilidad y disponibilidad.
- **Manejo de rutas dinámicas** y respuestas eficientes para diferentes endpoints.

---

### 🧱 Arquitectura del Proyecto

```
MedicalScheduling/
├── lambdas/              # Funciones Lambda para manejar las rutas
├── infrastructure/       # Configuraciones de infraestructura (Serverless)
├── _layers/              # Capas compartidas para reutilizar código
├── docs/                 # Especificación OpenAPI para Swagger
├── serverless.yml        # Configuración principal del Serverless Framework
├── docker-compose.yml    # Entorno de desarrollo local
└── README.md             # Este archivo
```

---

### 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **AWS Lambda**: Computación sin servidores para ejecutar código bajo demanda.
- **API Gateway**: Puerta de enlace para exponer las funciones Lambda como API RESTful.
- **Serverless Framework**: Herramienta para desplegar y gestionar aplicaciones sin servidor.
- **Swagger UI**: Interfaz visual para interactuar y probar la API.
- **Docker**: Contenedores para facilitar el desarrollo y pruebas locales.

---

### 📄 Documentación de la API

La documentación interactiva de la API está disponible a través de Swagger UI. Puedes acceder a ella desplegando el proyecto y navegando a:

```
https://03d28hz5c7.execute-api.us-east-1.amazonaws.com/dev/docs
```

---

### 🧪 Pruebas y Desarrollo Local

Para facilitar el desarrollo y las pruebas locales, puedes utilizar Docker:

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/lxandrexl/MedicalScheduling.git
   cd MedicalScheduling
   ```

2. **Inicia la base de datos local en Docker**:

   ```bash
   docker-compose up
   ```

---

### 🌐 Despliegue en AWS

El proyecto está configurado para desplegarse fácilmente en AWS utilizando Serverless Framework:

1. **Instala Serverless Framework** si aún no lo tienes:

   ```bash
   npm install -g serverless
   ```

2. **Empaqueta la aplicación**:

   ```bash
   npm run sls-package
   ```

3. **Despliega la aplicación**:

   ```bash
   npm run sls-deploy
   ```

4. **Obtén la URL de la API** desde la salida del comando anterior.

---

### 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto o deseas colaborar, no dudes en abrir un issue o enviar un pull request.

---

### 📫 Contacto

¿Tienes preguntas o comentarios? Puedes contactarme a través de:

- **GitHub**: [@lxandrexl](https://github.com/lxandrexl)
- **Correo electrónico**: [javillenad@gmail.com](mailto:javillenad@gmail.com)

---

### 🌟 Reconocimientos

Este proyecto fue desarrollado como parte de mi portafolio personal para demostrar mis habilidades en desarrollo backend y despliegue en la nube. ¡Gracias por tomarte el tiempo de revisarlo!

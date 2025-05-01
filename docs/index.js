const fs = require("fs");
const path = require("path");

module.exports.handler = async (event) => {
  // Obtener la URL del API Gateway de manera dinámica
  const apiUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
  const openApiUrl = `${apiUrl}/docs/openapi.yml`; // Construimos la URL de OpenAPI dinámicamente

  // Si la petición es para obtener el archivo OpenAPI YAML
  if (event.path === "/docs/openapi.yml") {
    try {
      // Suponiendo que el archivo 'openapi.yml' esté en el directorio actual de la Lambda
      const yamlContent = fs.readFileSync(
        path.join(__dirname, "openapi.yml"),
        "utf8"
      );
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/yaml",
        },
        body: yamlContent,
      };
    } catch (error) {
      console.error("Error leyendo openapi.yml", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error interno al leer la documentación",
        }),
      };
    }
  }

  // Si la petición es para la página HTML con Swagger UI
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store", // Evitar caché para Swagger UI
    },
    body: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>API Documentation</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui.css">
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = () => {
              SwaggerUIBundle({
                url: '${openApiUrl}',
                dom_id: '#swagger-ui',
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                layout: "BaseLayout",
              });
            };
          </script>
        </body>
      </html>
    `,
  };
};

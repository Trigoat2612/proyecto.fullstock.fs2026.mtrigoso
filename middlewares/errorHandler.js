const ERROR_TITLES = {
  400: "Solicitud incorrecta",
  401: "No autorizado",
  403: "Prohibido",
  404: "No encontrado",
  500: "Error interno del servidor",
};

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Algo salió mal...";

  res.status(statusCode).render("error", {
    errorTitle: `${statusCode} - ${ERROR_TITLES[statusCode] || "Error"}`,
    errorMessage: message,
  });
}

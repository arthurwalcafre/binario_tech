const autorizarPerfil = (perfisPermitidos) => {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        status: "ACESSO_NEGADO",
        mensagem: "Você não tem permissão para acessar este recurso."
      });
    }
    next();
  };
};

module.exports = autorizarPerfil;

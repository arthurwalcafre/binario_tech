module.exports = (req, res, next) => {
    const { cnh } = req.body;
    const regexCnh = /^\d{11}$/;

    if (!cnh || !regexCnh.test(cnh.toString())) {
        return res.status(400).json({ 
            erro: "CNH inválida. A CNH deve conter exatamente 11 dígitos numéricos." 
        });
    }

    next();
};


const getDollarYadio = require('../../utils/getDollarYadio');

const handler = (_, res) => {
    getDollarYadio();
    return res.json({ message: "Se ha actualizado la tasa de yadio."})
}

module.exports = handler
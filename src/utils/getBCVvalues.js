const cheerio = require('cheerio');

async function obtenerValoresBCV() {
  const url = 'https://www.bcv.org.ve/terminos-condiciones';

  const $ = await cheerio.fromURL(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
  });

  // Euro
  const euroDiv = $('#euro .field-content .row.recuadrotsmc');
  const stringEuroValue = euroDiv.find('div.col-sm-6.col-xs-6.centrado').find('strong').text().trim();
  const euroValue = stringEuroValue.replace(',', '.');
  const euro = Number(euroValue).toFixed(2);
  
  // Dólar
  const dollarDiv = $('#dolar .field-content .row.recuadrotsmc');
  const dollarStringValue = dollarDiv.find('div.col-sm-6.col-xs-6.centrado').find('strong').text().trim();
  const dollarValue = dollarStringValue.replace(',', '.');
  const dollar = Number(dollarValue).toFixed(2);

  return { euro, dollar };
}

module.exports = obtenerValoresBCV;
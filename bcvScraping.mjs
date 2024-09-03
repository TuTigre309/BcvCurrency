import fetch from 'node-fetch'; // Importa el módulo node-fetch
import cheerio from 'cheerio';
import https from 'https'; // Importa el módulo https

// Crea un nuevo agente con verificación de certificado deshabilitada
const agent = new https.Agent({
  rejectUnauthorized: false,
});

export async function getExchangeRate() {
  try {
    const response = await fetch('https://www.bcv.org.ve', { agent });
    const data = await response.text();

    const $ = cheerio.load(data); // Cargamos la página con Cheerio
    const exchangeRateText = $('#dolar div div div strong').text(); // Seleccionamos el elemento <strong> dentro de #dolar
    const exchangeRate = parseFloat(exchangeRateText.replace(',', '.')).toFixed(2);

    console.log('Tipo de cambio (USD):', exchangeRate);
    return exchangeRate;
  } catch (error) {
    console.error('Error al obtener el tipo de cambio:', error.message);
    return null;
  }
}

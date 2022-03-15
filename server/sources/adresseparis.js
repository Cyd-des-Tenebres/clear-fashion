const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-container .right-block')
    .map((i, element) => {
      const name = $(element)
        .find('.versionpc .product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      console.log(name)
      const price = parseInt
      (
        $(element)
          .find('.price')
          .text()
      );
      const link =$(element)
        .find('.product-name')
        .attr('href')
      const brand='ADRESSE Paris'

      return {name, price, link, brand};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

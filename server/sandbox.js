/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseparis=require('./sources/adresseparis')
const montlimart=require('./sources/montlimart')
const fs=require('fs')

const dedicatedbrandURL="https://www.dedicatedbrand.com/en/men/t-shirts"
const adresseparisURL='https://adresse.paris/602-nouveautes'
const montlimartURL='https://www.montlimart.com/fabrique-en-france.html'
const websites=[dedicatedbrandURL, adresseparisURL, montlimartURL]
const brands=[dedicatedbrand, adresseparis, montlimart]    

async function sandbox () {
  try {
    var products=[]
    
    for(let k=0; k<3; k++)
    {
      console.log(`🕵️‍♀️  browsing ${websites[k]} source`);

      var currentProducts = await brands[k].scrape(websites[k]);
      for(let i in currentProducts)
      {
        products.push(currentProducts[i])
      }
    }
    fs.writeFileSync('products.json', JSON.stringify(products))
    /*
    products.forEach(products => 
    {
      console.log(products.name, products.price, products.link);
    })
    */
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox();


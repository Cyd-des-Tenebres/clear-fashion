// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let allProducts=[];
let brands=new Set(["All"]);
let currentBrand="All"

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select')
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const sectionBrands=document.querySelector('#brand-select')

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand=currentBrand) => {
  try {
    
    //console.log(brand)
    
    let response= await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    
    //console.log(response)
    
    if(brand!="All")
    {
      
      //console.log("In the if")
      
      response = await fetch(
        `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
      );
      
      //console.log(response)
    
    }
    
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  //console.log(currentPagination.currentPage);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  allProducts=await fetchProducts(1,139)
  createBrandList(allProducts)
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the page to display
 */

 selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentProducts.length);
  //console.log(currentProducts.length);
  setCurrentProducts(products);
  
  //console.log(products)

  render(currentProducts, currentPagination);
});

/**
 * Select the brand to display
 */

const createBrandList=products=>
{
  //console.log(products)
  //console.log(products['result'][0]['brand'])
  for(let k=0; k<products['result'].length; k++)
  {
    brands.add(products['result'][k]['brand'])
    //console.log(products['result'][k]['brand'])
  }

  const options = Array.from(
    brands,
    (value) => `<option value="${value}">${value}</option>`
  ).join('');

  //console.log(products['result'][0]["brand"])
  //console.log(brands)
  //console.log(options)

  sectionBrands.innerHTML = options;
  selectBrand.selectedIndex = options[0];
  
}

 selectBrand.addEventListener('change', async (event) => 
 {
  currentBrand=event.target.value
  const products = await fetchProducts(currentPagination.currentPage, currentProducts.length, currentBrand);

  //console.log(products['result'])
  //console.log(products['result'][0]['brand'])

  setCurrentProducts(products);

  render(currentProducts, currentPagination);
});
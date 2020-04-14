const {parse} = require('node-html-parser');
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36';

const stores = {
  walmart: {
    items: ['neon'],
    userLinks: ['https://www.walmart.ca/en/ip/nintendo-switch-with-neon-blue-and-neon-red-joycon-nintendo-switch/6000200280557'],
    method: 'POST',
    url: 'https://www.walmart.ca/api/product-page/price-offer',
    body: {
      "availabilityStoreId": "3124",
      "fsa": "P7B",
      "experience": "whiteGM",
      "products": [{"productId": "6000200280557", "skuIds": ["6000200280558"]}],
      "lang": "en"
    },
    quantities: json => [json.offers[Object.keys(json.offers)].availableQuantity],
  },
  staples: {
    items: ['grey', 'neon'],
    userLinks: ['https://www.staples.ca/products/2956571-en-nintendo-switch-hardware-grey-refresh',
      'https://www.staples.ca/products/2956570-en-nintendo-switch-hardware-bluered-refresh'],
    method: 'POST',
    url: 'https://staplescms.staples.ca/api/inventory',
    body: {
      "ivrequest": {
        "postalCode": "M5C1S8",
        "channel": "WEB",
        "tenantId": "StaplesCA",
        "locale": "en-CA",
        "operationMode": "REALTIME",
        "items": [
          {"itemId": "2956571", "requestedquantity": 1000},
          {"itemId": "2956570", "requestedquantity": 1000}
        ]
      }
    },
    headers: {
      Origin: 'https://www.staples.ca',
      Host: 'staplescms.staples.ca',
      'Content-type': 'application/json'
    },
    quantities: json => [json.items[0].availablequantity, json.items[1].availablequantity],
  },
  bestbuy: {
    items: ['neon', 'grey'],
    userLinks: ['https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625',
      'https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-grey-joy-con/13817626'],
    method: 'GET',
    url: 'https://www.bestbuy.ca/ecomm-api/availability/products?skus=13817625|13817626&accept=application/vnd.bestbuy.standardproduct.v1%2Bjson',
    quantities: json => [json.availabilities[0].shipping.quantityRemaining, json.availabilities[1].shipping.quantityRemaining],
  },
  thesourse_grey: {
    items: ['grey'],
    url: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-grey-joy%e2%80%91con%e2%84%a2/p/108063995#product-store-availability',
    userLinks: ['https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-grey-joy%e2%80%91con%e2%84%a2/p/108063995#product-store-availability'],
    method: 'GET',
    quantities: text => [text.includes('out of stock online') ? 0 : true],
  },
  thesourse_neon: {
    items: ['neon'],
    url: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867',
    userLinks: ['https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867'],
    method: 'GET',
    quantities: text => [text.includes('out of stock online') ? 0 : true],
  },
  ebgames_grey: {
    items: ['grey'],
    url: 'https://www.ebgames.ca/Switch/Games/771003/nintendo-switch-with-gray-joy-con',
    userLinks: ['https://www.ebgames.ca/Switch/Games/771003/nintendo-switch-with-gray-joy-con'],
    method: 'GET',
    quantities: text => [text.toLowerCase().includes('out of stock') ? 0 : true],
  },
  ebgames_neon: {
    items: ['neon'],
    url: 'https://www.ebgames.ca/Switch/Games/771002/nintendo-switch-with-neon-blue-and-neon-red-joy-con',
    userLinks: ['https://www.ebgames.ca/Switch/Games/771002/nintendo-switch-with-neon-blue-and-neon-red-joy-con'],
    method: 'GET',
    quantities: text => [text.toLowerCase().includes('out of stock') ? 0 : true],
  },
  amazon: {
    items: ['neon + grey'],
    url: 'https://www.amazon.ca/gp/offer-listing/B07WQYRLGT/ref=olp_twister_all?ie=UTF8&mv_platform_for_display=all&qid=1586758809&sr=8-1',
    userLinks: ['https://www.amazon.ca/gp/offer-listing/B07WQYRLGT/ref=olp_twister_all?ie=UTF8&mv_platform_for_display=all&qid=1586758809&sr=8-1'],
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    },
    quantities: text => {
      const root = parse(text);
      const pricesText = root.querySelectorAll('span.a-size-large.a-color-price.olpOfferPrice.a-text-bold');
      const prices = pricesText.map(priceText => parseFloat(priceText.innerHTML.match(/[0-9]*[.][0-9]*/)[0]));
      const lowestPrice = prices.sort()[0];
      console.log('Amazon lowest price: ', prices[0], prices[1]);
      if (parseInt(lowestPrice) === 399) {
        return [true];
      }
      return [0];
    }
  },
  amazon_ac: {
    items: ['animal crossing se'],
    url: 'https://www.amazon.ca/gp/offer-listing/B084DDDNRP',
    userLinks: ['https://www.amazon.ca/gp/offer-listing/B084DDDNRP/ref=dp_olp_0?ie=UTF8&condition=all&qid=1586886581&sr=8-1'],
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    },
    quantities: text => {
      const root = parse(text);
      const pricesText = root.querySelectorAll('span.a-size-large.a-color-price.olpOfferPrice.a-text-bold');
      const prices = pricesText.map(priceText => parseFloat(priceText.innerHTML.match(/[0-9]*[.][0-9]*/)[0]));
      const lowestPrice = prices.sort()[0];
      console.log('Amazon lowest price: ', lowestPrice);
      if (parseInt(lowestPrice) <= 410) {
        return [true];
      }
      return [0];
    }
  }
};

delete stores.amazon_ac;

module.exports = {stores};

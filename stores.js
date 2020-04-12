const {parse} = require('node-html-parser');
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36';

const stores = {
  walmart_blue_red: {
    userLink: 'https://www.walmart.ca/en/ip/nintendo-switch-with-neon-blue-and-neon-red-joycon-nintendo-switch/6000200280557',
    method: 'POST',
    url: 'https://www.walmart.ca/api/product-page/price-offer',
    body: {
      "availabilityStoreId": "3124",
      "fsa": "P7B",
      "experience": "whiteGM",
      "products": [{"productId": "6000200280557", "skuIds": ["6000200280558"]}],
      "lang": "en"
    },
    quantity: json => json.offers[Object.keys(json.offers)].availableQuantity,
  },
  staples_grey: {
    userLink: 'https://www.staples.ca/products/2956571-en-nintendo-switch-hardware-grey-refresh',
    method: 'POST',
    url: 'https://staplescms.staples.ca/api/inventory',
    body: {
      "ivrequest": {
        "postalCode": "M5C1S8",
        "channel": "WEB",
        "tenantId": "StaplesCA",
        "locale": "en-CA",
        "operationMode": "REALTIME",
        "items": [{"itemId": "2956571", "requestedquantity": 1000}]
      }
    },
    headers: {
      Origin: 'https://www.staples.ca',
      Host: 'staplescms.staples.ca',
      'Content-type': 'application/json'
    },
    quantity: json => json.items[0].availablequantity,
  },
  staples_blue_red: {
    userLink: 'https://www.staples.ca/products/2956570-en-nintendo-switch-hardware-bluered-refresh',
    method: 'POST',
    url: 'https://staplescms.staples.ca/api/inventory',
    body: {
      "ivrequest": {
        "postalCode": "M5C1S8",
        "channel": "WEB",
        "tenantId": "StaplesCA",
        "locale": "en-CA",
        "operationMode": "REALTIME",
        "items": [{"itemId": "2956570", "requestedquantity": 1000}]
      }
    },
    headers: {
      Origin: 'https://www.staples.ca',
      Host: 'staplescms.staples.ca',
      'Content-type': 'application/json'
    },
    quantity: json => json.items[0].availablequantity,
  },
  bestbuy_blue_red: {
    userLink: 'https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625',
    method: 'GET',
    url: 'https://www.bestbuy.ca/ecomm-api/availability/products?skus=13817625&accept=application/vnd.bestbuy.standardproduct.v1%2Bjson',
    quantity: json => json.availabilities[0].shipping.quantityRemaining,
  },
  bestbuy_grey: {
    userLink: 'https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-grey-joy-con/13817626',
    method: 'GET',
    url: 'https://www.bestbuy.ca/ecomm-api/availability/products?skus=13817626&accept=application/vnd.bestbuy.standardproduct.v1%2Bjson',
    quantity: json => json.availabilities[0].shipping.quantityRemaining,
  },
  thesourse_grey: {
    url: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-grey-joy%e2%80%91con%e2%84%a2/p/108063995#product-store-availability',
    userLink: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-grey-joy%e2%80%91con%e2%84%a2/p/108063995#product-store-availability',
    method: 'GET',
    quantity: text => text.includes('out of stock online') ? 0 : true,
  },
  thesourse_blue_red: {
    url: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867',
    userLink: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867',
    method: 'GET',
    quantity: text => text.includes('out of stock online') ? 0 : true,
  },
  amazon_neon: {
    url: 'https://www.amazon.ca/gp/offer-listing/B07VGRJDFY/ref=olp_twister_child?ie=UTF8&mv_platform_for_display=1',
    userLink: 'https://www.amazon.ca/gp/offer-listing/B07VGRJDFY/ref=olp_twister_child?ie=UTF8&mv_platform_for_display=1',
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    },
    quantity: text => {
      const root = parse(text);
      const pricesText = root.querySelectorAll('span.a-size-large.a-color-price.olpOfferPrice.a-text-bold');
      const prices = pricesText.map(priceText => parseFloat(priceText.innerHTML.match(/[0-9]*[.][0-9]*/)[0]));
      const lowestPrice = prices.sort()[0];
      console.log('Amazon lowest price: ', lowestPrice);
      if (parseInt(lowestPrice) === 399) {
        return true;
      }
      return 0;
    }
  },
  amazon_grey: {
    url: 'https://www.amazon.ca/gp/offer-listing/B07VJRZ62R/ref=olp_twister_child?ie=UTF8&mv_platform_for_display=0',
    userLink: 'https://www.amazon.ca/gp/offer-listing/B07VJRZ62R/ref=olp_twister_child?ie=UTF8&mv_platform_for_display=0',
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    },
    quantity: text => {
      const root = parse(text);
      const pricesText = root.querySelectorAll('span.a-size-large.a-color-price.olpOfferPrice.a-text-bold');
      const prices = pricesText.map(priceText => parseFloat(priceText.innerHTML.match(/[0-9]*[.][0-9]*/)[0]));
      const lowestPrice = prices.sort()[0];
      console.log('Amazon lowest price: ', lowestPrice);
      if (parseInt(lowestPrice) === 399) {
        return true;
      }
      return 0;
    }
  }
};

module.exports = {stores};

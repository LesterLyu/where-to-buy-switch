const fetch = require('node-fetch');
const {send} = require('./mailer');

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
    quantity: text => text.includes('out of stock online') ? 0 : 1,
  },
  thesourse_blue_red: {
    url: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867',
    userLink: 'https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108068867',
    method: 'GET',
    quantity: text => text.includes('out of stock online') ? 0 : 1,
  }
};

const getQuantity = async (store) => {
  const res = await fetch(store.url,
    {
      method: store.method,
      body: store.body ? JSON.stringify(store.body) : undefined,
      headers: store.headers
    });
  let json;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch (e) {
    // For Bestbuy
    try {
      json = JSON.parse(text.substring(1));
    } catch (e) {
      json = text;
    }
  }
  // console.log(json)
  try {
    return store.quantity(json);
  } catch (e) {
    console.error("Failed to get data from", store.url);
    console.error(e);
    return 0
  }
};

async function main() {
  while(1) {
    for (const [storeName, store] of Object.entries(stores)) {
      const quantity = await getQuantity(store);
      if (quantity > 0) {
        console.error(storeName, 'has', quantity, store.userLink)
        send(`${storeName} has ${quantity} <a href="${store.userLink}">link</a>`)
      } else
        console.log(storeName, 'has 0')
    }
    await sleep(10000)
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();

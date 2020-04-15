const fetch = require('node-fetch');
const open = require('open');
const {send} = require('./mailer');
const {stores} = require('./stores');

let lastLink = '';

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
    return store.quantities(json);
  } catch (e) {
    console.error("Failed to get data from", store.url);
    console.error(e);
    return 0
  }
};

async function checkStore(storeName, store) {
  let quantities = await getQuantity(store);
  for (let i = 0; i < quantities.length; i++) {
    const quantity = quantities[i];
    if (quantity > 0) {
      console.error(storeName, store.items[i], 'has', quantity === true ? '>=1' : quantity, store.userLinks[i]);

      if (lastLink !== store.userLinks[i]) {
        open(store.userLinks[i]);
        lastLink = store.userLinks[i];
      }

      send(`${storeName} ${store.items[i]} has ${quantity === true ? '>=1' : quantity} <a href="${store.userLinks[i]}">link</a>`)
    } else
      console.log(storeName, store.items[i], 'has 0')
  }
}

async function main() {
  while (1) {
    const timeWait = 3000 + Math.random() * 7 * 1000;
    const promises = [];
    for (const [storeName, store] of Object.entries(stores)) {
      promises.push(checkStore(storeName, store));
    }
    console.clear();
    console.log(Date());
    await Promise.all(promises);
    console.log('Refresh after', Math.round(timeWait / 1000), 's...');
    await sleep(timeWait)
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// periodic clean the last link
setInterval(() => lastLink = '', 60 * 1000);

main();

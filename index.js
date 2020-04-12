const fetch = require('node-fetch');
const {send} = require('./mailer');
const {stores} = require('./stores');

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

async function checkStore(storeName, store) {
  const quantity = await getQuantity(store);
  if (quantity > 0) {
	console.error(storeName, 'has', quantity === true ? '>=1' : quantity, store.userLink)
	send(`${storeName} has ${quantity} <a href="${store.userLink}">link</a>`)
  } else
	console.log(storeName, 'has 0')
}

async function main() {
  while(1) {
	const promises = [];
    for (const [storeName, store] of Object.entries(stores)) {
      promises.push(checkStore(storeName, store));
    }
	console.log('---')
	await Promise.all(promises);
    await sleep(8000)
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();

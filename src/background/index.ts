// console.log('background is running')

import openOptionsPage = chrome.runtime.openOptionsPage;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "API_CALL") {
    console.log('API call')
    fetch("https://jovoc.com/api/coupon/verify", {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
      },
    })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data: data }))
        .catch(error => sendResponse({ success: false, error: error.message }));

    return true;  // Keeps the sendResponse callback open
  }
});


chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "openOptionsPage":
      openOptionsPage();
      break;
    default:
      break;
  }
});



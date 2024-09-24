import {startBot} from "../utils/bot/Run";
import {displayMsgId} from "../data/values";
import {setMsg} from "../utils/ui/msgLog";


const injectUI = () => {
    const msgDiv = document.createElement('div');
    msgDiv.id = 'twt-auto-post-msg-div';
    msgDiv.innerHTML = `<div id="${displayMsgId}">Bot 🤖 waiting to start</div>`;

    document.body.appendChild(msgDiv);
}

injectUI();


// Listener in the content script to receive messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log('request', request);
    if(request?.TYPE === 'action' && request?.MESSAGE === 'startBot'){
       // console.log('trigger bot here');
       startBot();

        setMsg('Bot 🤖 initializing ⚡...');
        setTimeout(()=>{
            setMsg('⏳ Preparing contents...');
        }, 1000);
        setTimeout(()=>{
            setMsg('🤖 Scheduled 🕒 for posting...');
        }, 2000);
    }

    // Respond with some data if needed
    // sendResponse({ status: "success", data: result });
});

// Example content script function
function yourContentScriptFunction() {
    console.log("Content script function called!");
    return "Content script executed!";
}

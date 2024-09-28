import {startBot, stopBot} from "../utils/bot/Run";
import {displayMsgId} from "../data/values";
import {setMsg} from "../utils/ui/msgLog";


const injectUI = () => {
    const msgDiv = document.createElement('div');
    msgDiv.id = 'twt-auto-post-msg-div';
    msgDiv.innerHTML = `<div id="${displayMsgId}">Bot 🤖 waiting to start</div>`;

    document.body.appendChild(msgDiv);
}

injectUI();






let botRunning = false;

// Listener in the content script to receive messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.TYPE === 'action') {
        if (request.MESSAGE === 'getBotState') {
            console.log('content script getBotState', request.MESSAGE);
            sendResponse({ botRunning });
            return true;
        }
        else if (request.MESSAGE === 'toggleBotState') {
            botRunning = !botRunning;

            if(botRunning){
                startBot();
                setMsg('Bot 🤖 initializing ⚡...');
                setTimeout(() => {
                    setMsg('⏳ Preparing contents...');
                }, 500);
                setTimeout(() => {
                    setMsg('🤖 Scheduled 🕒 for posting...');
                }, 1000);
            }else {
                stopBot();
            }

            sendResponse({ botRunning });
            return true;
        }
    }
});


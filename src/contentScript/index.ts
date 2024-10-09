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

// If not enabled, value will be set to 0, thus no delay will be applied.
let botStartDelay = 0; // in minutes.

// Listener in the content script to receive messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.TYPE === 'action') {
        if (request.MESSAGE === 'getBotState') {
            console.log('content script getBotState', request.MESSAGE);
            sendResponse({ botRunning });
            return true;
        }
        else if (request.MESSAGE === 'toggleBotState') {
            chrome.storage.local.get(['content', 'isBotStartDelayEnabled', 'botStartDelay'], (result) => {
                if(result.content){
                    botRunning = !botRunning;
                    if(botRunning){
                        if(result.isBotStartDelayEnabled){
                            botStartDelay = result.botStartDelay;
                        }

                        setTimeout(()=>{
                            startBot();
                            setMsg('Bot 🤖 initializing ⚡...');
                            setTimeout(() => {
                                setMsg('⏳ Preparing contents...');
                            }, 500);
                            setTimeout(() => {
                                setMsg('🤖 Scheduled 🕒 for posting...');
                            }, 1000);
                        }, botStartDelay*60*1000); // minute to millis
                    }else {
                        stopBot();
                    }

                    sendResponse({ botRunning });
                    return true;
                }else{
                    setMsg('No content found !\nYou can add content in settings');
                }
            });
        }
    }
});



export const reloadCurrentTab = (): void => {
    if (!chrome.tabs) {
        console.error("chrome.tabs is undefined");
        return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}


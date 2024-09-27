import './Popup.css'
import settingsIcon from '../../public/icons/settings-icon.png';
import {openSettingsPage} from "../utils/ui/Actions";
import {appName} from "../data/values";
import {useEffect, useState} from "react";



const sendMessageToContentScript = (type: string, message: string, callback: (response: any) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
            console.error('No active tab found.');
            return;
        }
        chrome.tabs.sendMessage(activeTab.id, {
            TYPE: type,
            MESSAGE: message
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending message to content script:', chrome.runtime.lastError);
                return;
            }
            if (response) {
                callback(response);
            } else {
                console.error('No response from content script');
            }
        });
    });
};




export const Popup = () => {
    const [botRunning, setBotRunning] = useState(false);

    // Fetch the current bot running state from the background
    useEffect(() => {
        sendMessageToContentScript('action', 'getBotState', (response)=>{
            setBotRunning(response.botRunning);
        });
    }, []);


    const handleAppStateClick = () => {
        // Toggle state in the content script
        sendMessageToContentScript('action', 'toggleBotState', (response)=>{
            //console.log('popup toggleBotState', response);
            setBotRunning(response.botRunning || false);
        });

        setTimeout(()=>{
            window.close();
        }, 200);
    };

  return (
    <main>
      <h2>{appName}</h2>

      <div className="msg1">
          <p>Trigger by clicking this button</p>
          <button
              className={`btn-trigger ${botRunning ? 'running' : ''}`}
              onClick={handleAppStateClick}
          >{botRunning? 'Stop' : 'Start'} Bot</button>
      </div>

        <div className="settings-container">
          <img className="icon icon-settings" src={settingsIcon} alt="Settingts Icon"/>
          <div className="settings-label" onClick={openSettingsPage}>Customize More</div>
      </div>
    </main>
  )

}

export default Popup

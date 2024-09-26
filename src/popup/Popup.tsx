import './Popup.css'
import settingsIcon from '../../public/icons/settings-icon.png';
import {openSettingsPage} from "../utils/ui/Actions";
import {appName} from "../data/values";
import {useState} from "react";


// this message is received by contentScript
const sendMessageToContentScript = (type: string, message: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
            chrome.tabs.sendMessage(activeTab.id, {
                TYPE: type,
                MESSAGE: message
            });
        }
    });
};


export const Popup = () => {

    const [botRunning, setBotRunning] = useState(false);

    const handleAppStartClick = () => {
        setBotRunning(!botRunning); // toggle state
        let command = botRunning ? 'stopBot' : 'startBot';
        sendMessageToContentScript('action', command);
        //window.close();
    }

  return (
    <main>
      <h2>{appName}</h2>

      <div className="msg1">
          <p>Start by clicking this button</p>
          <button
              onClick={handleAppStartClick}
          >Start Bot</button>
      </div>

        <div className="settings-container">
          <img className="icon icon-settings" src={settingsIcon} alt="Settingts Icon"/>
          <div className="settings-label" onClick={openSettingsPage}>Customize More</div>
      </div>
    </main>
  )

}

export default Popup

import React, { useState, useEffect } from 'react';
import {showPopupMessage} from "./notifications/showPopupMessage";

const StartBotDelay: React.FC = () => {
    const [isBotStartDelayEnabled, setIsBotStartDelayEnabled] = useState<boolean>(false);
    const [botStartDelay, setBotStartDelay] = useState<number>(90);

    // Load saved settings from Chrome storage on component mount
    useEffect(() => {
        chrome.storage.local.get(['isBotStartDelayEnabled', 'botStartDelay'], (result) => {
            console.log(result)
            if (result.isBotStartDelayEnabled !== undefined) setIsBotStartDelayEnabled(result.isBotStartDelayEnabled);
            if (result.botStartDelay !== undefined) setBotStartDelay(result.botStartDelay);
        });
    }, []);


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsBotStartDelayEnabled(newValue);
        chrome.storage.local.set({ isBotStartDelayEnabled: newValue });
        showPopupMessage(`${newValue ? 'Delay Enabled 👍' : 'Delay Disabled 🚫'}`, 'success')
    };

    const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setBotStartDelay(newValue);
        chrome.storage.local.set({ botStartDelay: newValue });
        showPopupMessage('Value saved', 'success')
    };


    return (
        <div>
            <input
                type="checkbox"
                checked={isBotStartDelayEnabled}
                onChange={handleCheckboxChange}
                style={{marginLeft: 0, maxWidth: '20px'}}
            />
            <span>Start Bot After </span> &nbsp;
            <span style={{opacity: isBotStartDelayEnabled ? 1 : 0.3}}>
                <input
                    type="number"
                    id="start-delay"
                    min={1}
                    max={300}
                    value={botStartDelay}
                    onChange={handleDelayChange}
                    disabled={!isBotStartDelayEnabled}
                    style={{maxWidth: '100px'}}
                />
                <span>minutes</span>
            </span>
        </div>
    );
};

export default StartBotDelay;

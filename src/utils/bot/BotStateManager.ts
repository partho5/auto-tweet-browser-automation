import {defaultPostingGapMax, defaultPostingGapMin} from "../../data/values";
import {minuteToMilliseconds, todayFullDate} from "../time/TimeUtils";
import {clearDailyLimitMessage, clearInputField} from "./TweeterInteract";
import {setMsg} from "../ui/msgLog";
import {activateBot, runBot, startBot} from "./Run";
import {sendMessageToContentScript} from "../../popup/Popup";

interface BotState {
    botState: boolean;
    minGap: number;
    maxGap: number;
}

const defaultBotState: BotState = {
    botState: false,
    minGap: defaultPostingGapMin,
    maxGap: defaultPostingGapMax,
};

const loadBotState = (callback: (botState: BotState) => void): void => {
    chrome.storage.local.get(['botState', 'minGap', 'maxGap'], (result) => {
        // Merge the loaded values or fallback to defaults if not found
        const botState: BotState = {
            botState: result.botState !== undefined ? result.botState : defaultBotState.botState,
            minGap: result.minGap !== undefined ? result.minGap : defaultBotState.minGap,
            maxGap: result.maxGap !== undefined ? result.maxGap : defaultBotState.maxGap,
        };

        // Call the provided callback function with the loaded state
        callback(botState);
    });
};

/*
* @param delay in minutes
* */
export const resumeBotAfter = (delay: number) => {
    const delayMillis = minuteToMilliseconds(delay);
    console.log('delayMillis ', delayMillis);
    setTimeout(()=>{
        setMsg('Bot started again');
        clearDailyLimitMessage();
        startBot();
    }, delayMillis);
}


export const savePostCount = (postCount: number) => {
    const today = todayFullDate();
    console.log('today', today)

    chrome.storage.sync.get('dailyPostCount', (data) => {
        const dailyPostCount = data.dailyPostCount || {};
        dailyPostCount[today] = postCount; // Update today's count

        chrome.storage.sync.set({'dailyPostCount': dailyPostCount});
    });
};

export const getTodayPostCount = async (): Promise<number> => {
    const today = todayFullDate();

    const { dailyPostCount = {} } = await chrome.storage.sync.get(['dailyPostCount']);
    //console.log('dailyPostCount', dailyPostCount);
    return dailyPostCount[today] || 0; // Return today's count or 0 if not found
};



// NOT complete yet
export const getLast30DaysPostCount = (callback: (counts: { date: string; count: number }[]) => void) => {
    chrome.storage.sync.get('dailyPostCount', (data) => {
        const dailyPostCount = data.dailyPostCount || {};
        const counts: { date: string; count: number }[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            counts.push({
                date: formattedDate,
                count: dailyPostCount[formattedDate] || 0 // Default to 0 if no count
            });
        }

        callback(counts); // Return the counts for the last 30 days
    });
};



// Example usage: Load the state and log it
loadBotState((botState) => {
    //console.log('Loaded bot state:', botState);
});

export { loadBotState };

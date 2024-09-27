import {defaultPostingGapMax, defaultPostingGapMin} from "../../data/values";

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


export const savePostCount = (postCount: number) => {
    // here used sync instead of local, so that multiple devices keep track of post count for a particular user.
    chrome.storage.sync.set({'totalPostCount': postCount})
}


// Example usage: Load the state and log it
loadBotState((botState) => {
    //console.log('Loaded bot state:', botState);
});

export { loadBotState };

interface BotState {
    postCount: number;
    isBotRunning: boolean;
    [key: string]: any; // Any additional state fields you might need
}

const defaultBotState: BotState = {
    postCount: 0,
    isBotRunning: true, // Default state of the bot
};

// Function to load the bot's state from Chrome's local storage
const loadBotState = (callback: (botState: BotState) => void): void => {
    chrome.storage.local.get(['botState'], (result) => {
        // If botState is not found, use the default state
        const botState: BotState = result.botState || defaultBotState;

        // Call the provided callback function with the loaded state
        callback(botState);
    });
};

// Example usage: Load the state and log it
loadBotState((botState) => {
    console.log('Loaded bot state:', botState);
});

export { loadBotState };

import {getTodayPostCount, loadBotState, resumeBotAfter, savePostCount} from "./BotStateManager";
import {dailyPostingQuotaExceeded, makePost} from "./TweeterInteract";
import {setMsg} from "../ui/msgLog";
import {randomMillis} from "../formatter/Numbers";
import {clockTimeAfter} from "../time/TimeUtils";
import {defaultPostingGapMax, defaultPostingGapMin} from "../../data/values";

let timeoutId: number | null = null;
let postCount = 0; // in current session
let todayPostCount = 0; // total of all time

const MAX_POSTS_PER_SESSION = 300; // Maximum posts in a session
const TARGET_POST_COUNT = 300; // How many tweets you want in one session
const SESSION_GAP = 3; // 3-hour pause
const DAILY_POSTING_QUOTA = 2400; // Total quota for the day

let isBotActive = false; // Bot active flag

// Start bot with posting logic
const startBot = async (): Promise<void> => {
    if (!isBotActive) {
        isBotActive = true;
        postCount = 0;
        todayPostCount = await getTodayPostCount(); // Retrieve the current day's post count
        console.log('Bot started.');

        runBot(); // Initiate bot operation
    }
};

// Core bot logic to handle posting and delays
const runBot = async (): Promise<void> => {
    const botState = await chrome.storage.local.get(['content', 'minGap', 'maxGap']);
    let min = botState.minGap || defaultPostingGapMin;
    let max = botState.maxGap || defaultPostingGapMax;

    if (parseInt(min) >= parseInt(max)) {
        min = defaultPostingGapMin;
        max = defaultPostingGapMax;
    }


    if (isBotActive && !dailyPostingQuotaExceeded()) {
        const randomDelay = randomMillis(min, max); // Generate random delay for next post
        timeoutId = window.setTimeout(async () => {
            const result = await makePost();

            if (result) {
                ++postCount;
                ++todayPostCount;
                savePostCount(todayPostCount);

                const remaining = Math.max(0, MAX_POSTS_PER_SESSION - postCount);
                setMsg(`🐤 Tweets Posted: ${postCount}\n🤖 will pause after ${remaining} posts`);
                console.log(`Post #${postCount} - delayed ${randomDelay} sec`);

                if (postCount < MAX_POSTS_PER_SESSION) {
                    runBot(); // Schedule next post
                } else {
                    stopBot();
                    resumeBotAfter(SESSION_GAP * 60); // Pause and resume after session gap
                }
            }
        }, randomDelay);
    } else {
        setMsg('Posting quota exceeded 🙄\nYou may have to wait 3 hours');
        console.log('Posting quota exceeded 🙄');
        stopBot();
        resumeBotAfter(SESSION_GAP * 60); // Resume after a certain time
    }
};

// Stop the bot and clear timeout
const stopBot = (): void => {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    isBotActive = false;
    setMsg('Bot 🤖 has been paused');
    console.log('Bot stopped.');
};


export const activateBot = () => {
    isBotActive = true;
}

// Export functions for external control
export {startBot, stopBot, runBot};

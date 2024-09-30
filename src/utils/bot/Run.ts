// Simulating the posting quota logic
import {getTodayPostCount, loadBotState, resumeBotAfter, savePostCount} from "./BotStateManager";
import {
    clearDailyLimitMessage,
    clearInputField,
    dailyPostingQuotaExceeded,
    duplicatePostContentDetected,
    makePost
} from "./TweeterInteract";
import {setMsg} from "../ui/msgLog";
import {generateRandomNum, randomMillis} from "../formatter/Numbers";
import {clockTimeAfter, hourToMilliseconds, minuteToMilliseconds} from "../time/TimeUtils";
import {defaultPostingGapMax, defaultPostingGapMin} from "../../data/values";
import {reloadCurrentTab} from "../../contentScript";
import {sendMessageToContentScript} from "../../popup/Popup";


let timeoutId: number | null = null;
let postCount = 0; // in current session
let todayPostCount = 0; // total of all time

const MAX_POSTS_PER_SESSION = 300; // Maximum posts in a session
const TARGET_POST_COUNT = 300; // How many tweet you want in one session
const SESSION_GAP = 3; // 3-hour pause
const DAILY_POSTING_QUOTA = 2400; // Total quota for the day

// Function to start posting with random intervals
const startBot = async (): Promise<void> => {
    let result = await chrome.storage.local.get(['content', 'minGap', 'maxGap']);
    let min = result.minGap || defaultPostingGapMin;
    let max = result.maxGap || defaultPostingGapMax;
    // In case user sets inconsistent values, we prevent malfunctioning by setting to default value
    if(parseInt(min) >= parseInt(max)){
        min = defaultPostingGapMin;
        max = defaultPostingGapMax;
    }

    result = await chrome.storage.sync.get(['todayPostCount']);
    todayPostCount = result.todayPostCount || 0;
    todayPostCount = await getTodayPostCount();
    console.log('todayPostCount', todayPostCount);

    const randomDelay = randomMillis(min, max); // args in seconds
    setTimeout(() => {
        const readableTime = clockTimeAfter(randomDelay);
        console.log(`Next post at ${readableTime}`);
    }, 3000);

    timeoutId = window.setTimeout(async () => {
        if (!dailyPostingQuotaExceeded()) {
            const result = await makePost();
            if (result) {
                ++postCount;
                ++todayPostCount;

                if(postCount <= MAX_POSTS_PER_SESSION){
                    savePostCount(todayPostCount);
                    const remaining = Math.max(0, MAX_POSTS_PER_SESSION-postCount);
                    setMsg(`🐤 Tweets Posted: ${postCount}\n🤖 will pause after ${remaining} posts`);
                    console.log(`post #${postCount} - delayed ${randomDelay} sec`);
                }else{
                    stopBot();
                    resumeBotAfter(SESSION_GAP * 60);

                    sendMessageToContentScript('action', 'toggleBotState', (response)=>{
                        console.log('popup toggleBotState', response);
                    });
                }
            }
        }else{
            setMsg('Posting quota exceeded 🙄\nYou may have to wait 3 hours');
            console.log('Posting quota exceeded 🙄');
            stopBot();

            // After certain time period, start the bot again.
            resumeBotAfter(MAX_POSTS_PER_SESSION * 60);
        }

        // Schedule the next post after a random delay
        startBot(); // Recursive call to schedule the next post
    }, randomDelay);
};

// Function to stop the bot
const stopBot = (): void => {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    //console.log('Bot stopped.');
    setMsg('Bot 🤖 has been paused')
};

export { startBot, stopBot };

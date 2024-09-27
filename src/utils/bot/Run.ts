// Simulating the posting quota logic
import {getTodayPostCount, loadBotState, savePostCount} from "./BotStateManager";
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


let timeoutId: number | null = null;
let postCount = 0; // in current session
let todayPostCount = 0; // total of all time

const MAX_POSTS_PER_SESSION = 300; // Maximum posts in a session
const TARGET_POST_COUNT = 300; // How many tweet you want in one session
const SESSION_GAP = 3; // 3-hour pause
const DAILY_POSTING_QUOTA = 2400; // Total quota for the day

// Function to start posting with random intervals
const startBot = async (): Promise<void> => {
    let result = await chrome.storage.local.get(['minGap', 'maxGap']);
    const min = result.minGap || defaultPostingGapMin;
    const max = result.maxGap || defaultPostingGapMax;

    result = await chrome.storage.sync.get(['todayPostCount']);
    todayPostCount = result.todayPostCount || 0;
    todayPostCount = await getTodayPostCount();
    console.log('todayPostCount', todayPostCount);

    const randomDelay = randomMillis(min, max); // args in seconds
    setTimeout(() => {
        const readableTime = clockTimeAfter(randomDelay);
        setMsg(`Next post at ${readableTime}`);
    }, 3000);

    timeoutId = window.setTimeout(async () => {
        // Load bot state from chrome storage
        loadBotState(async (botState) => {
            //console.log('botState', botState);
            if (!dailyPostingQuotaExceeded()) {
                const result = await makePost();
                if (result) {
                    ++postCount;
                    ++todayPostCount;
                    savePostCount(todayPostCount);
                    const remaining = Math.max(0, MAX_POSTS_PER_SESSION-postCount);
                    setMsg(`🐤 Tweets Posted: ${postCount}\n🤖 will pause after ${remaining} posts`);
                    //console.log(`post #${postCount} - delayed ${randomDelay} sec`);
                }
            }else{
                setMsg('Posting quota exceeded 🙄\nYou may have to wait 3 hours');
                console.log('Posting quota exceeded 🙄');
                stopBot();

                // After certain time period, start the bot again.
                setTimeout(()=>{
                    clearDailyLimitMessage();
                    clearInputField(); // in case previously populated content exists
                    startBot();
                    setMsg('Bot started again');
                }, minuteToMilliseconds(10)); // try to restart bot after some time. As it's inside a recursive call, so the process will be repeating
            }
        });

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
};

export { startBot, stopBot };

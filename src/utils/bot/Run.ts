import { calculatePostDelay, hourToMilliseconds } from "../time/TimeUtils";
import { BotState } from "../interface/TypeInterface";
import { postMessageWithDelay } from "./TweeterInteract";
import { generateContent } from "../data/PostContents";
import {setMsg} from "../ui/msgLog";
import {tweeterCharLimitNotExceeded} from "../formatter/strings";
import {addOrSubtractRandomNumber} from "../formatter/Numbers";

const MAX_POSTS_PER_SESSION = 300; // Maximum posts in a session
const TARGET_POST_COUNT = 2400; // Default post count but can be customized by user
const HOURS_PER_SESSION = 3; // Max value 3 hours, but can be set to less
const POST_GAP_TIME_PER_SESSION = hourToMilliseconds(3); // 3-hour pause
const TODAY_POSTING_QUOTA = 2400; // Total quota for the day


const makePost = async (textContents: string[], postDelay: number): Promise<void> => {
    try {
        textContents.forEach((text, index) => {
            if(tweeterCharLimitNotExceeded(text)){
                postMessageWithDelay(text, index * postDelay);
                // console.log(`${text} - postDelay=${postDelay} - ${new Date()}`);
            }
        });
    } catch (error) {
        console.error("Error making post:", error);
    }
};

// Function to save the bot's state in chrome local storage
const saveState = (state: {
    remainingPosts: number;
    todayPostCount: number;
    lastActiveDate: string;
    totalPostsMade: number;
}): void => {
    chrome.storage.local.set({ botState: state }, () => {
        // console.log('Bot state saved:', state);
    });
};

// Function to load the bot's state
const loadState = (callback: (state: BotState | null) => void): void => {
    chrome.storage.local.get(['botState'], (result) => {
        if (result.botState) {
            callback(result.botState);
        } else {
            callback(null); // No previous state found
        }
    });
};

// Function to log daily statistics via API call
const saveLog = async (logData: any): Promise<void> => {
    try {
        console.log("Logging data:", logData);
        // Placeholder for actual logging logic, e.g.:
        // await api.saveDailyStats(logData);
    } catch (error) {
        console.error("Error saving log data:", error);
    }
};

// Main function to start the bot
const startBot = (): void => {
    loadState(async (savedState) => {
        let todayPostCount = savedState?.todayPostCount || 0;
        let remainingPosts = savedState?.remainingPosts || MAX_POSTS_PER_SESSION;
        let totalPostsMade = savedState?.totalPostsMade || todayPostCount;

        console.log(`Starting bot. Today Post Count: ${todayPostCount}, Remaining Posts: ${remainingPosts}`);

        const currentDate = new Date().toISOString().slice(0, 10); // Use ISO format for comparison
        if (savedState?.lastActiveDate !== currentDate) {
            // Reset quotas if it's a new day
            todayPostCount = 0;
            totalPostsMade = 0;
            remainingPosts = MAX_POSTS_PER_SESSION;
            saveState({ todayPostCount, totalPostsMade, remainingPosts, lastActiveDate: currentDate });
            console.log("New day detected. Quota reset.");
        }

        let postDelay: number;
        try {
            postDelay = calculatePostDelay(totalPostsMade, TODAY_POSTING_QUOTA, hourToMilliseconds(HOURS_PER_SESSION), TARGET_POST_COUNT);
        } catch (error) {
            console.error("Error calculating post delay:", error);
            setMsg('Posting quota exceeded 🙄')
            return; // Exit the function if there's an error
        }

        // little delay so that user gets enough time to read any previous message shown
        setTimeout(()=>{
            setMsg('⏳ Preparing contents...');
        }, 3000);

        const postInterval = setInterval(async () => {
            if (remainingPosts > 0 && totalPostsMade < TODAY_POSTING_QUOTA) {
                const content = generateContent();
                if(content){
                    const textContents: string[] = [content];
                    await makePost(textContents, postDelay);
                    totalPostsMade++;
                    todayPostCount++;
                    remainingPosts--;

                    let message = `Posted tweets: ${todayPostCount}\nBot will pause after: ${remainingPosts} tweets`;
                    if(totalPostsMade >= TODAY_POSTING_QUOTA){
                        message = 'Daily tweeting quota exceeded 🙄';
                    }
                    setMsg(message);

                    // Save state after every post
                    saveState({ todayPostCount, totalPostsMade, remainingPosts, lastActiveDate: currentDate });

                    // console.log(`Posted: ${totalPostsMade}, Remaining: ${remainingPosts}`);

                    // If the bot reaches the limit for the session, log the data and pause for 3 hours
                    if (totalPostsMade % MAX_POSTS_PER_SESSION === 0 || remainingPosts === 0) {
                        await saveLog({ date: currentDate, postsMade: totalPostsMade });
                        clearInterval(postInterval);
                        console.log(`Reached ${MAX_POSTS_PER_SESSION} posts. Taking a break for 3 hours.`);

                        // Pause the bot for the defined gap before resuming
                        setTimeout(() => {
                            startBot();
                        }, POST_GAP_TIME_PER_SESSION);
                    }
                }else{
                    console.log("No content found to post");
                    setMsg('📢 Content not found to post');
                }
            } else {
                clearInterval(postInterval);
                console.log("Daily posting limit reached or no more posts to make.");
            }
        }, postDelay );

        // console.log(`Post Delay: ${postDelay} milliseconds`);
    });
};

export { startBot };

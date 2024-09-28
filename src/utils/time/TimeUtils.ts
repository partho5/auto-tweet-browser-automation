import {addOrSubtractRandomNumber, generateRandomNum} from "../formatter/Numbers";

export const hourToMilliseconds = (hour: number) => {
    return hour * 3600 * 1000;
}

export const minuteToMilliseconds = (minute: number) => {
    return minute * 60 * 1000;
}


/**
 * Calculates the delay between posts in milliseconds.
 *
 * @param todayPostCount - Number of posts already made today
 * @param todayPostingQuota - Total quota for posts in a day
 * @param timeAllotted - Time allotted for making posts in milliseconds
 * @param targetPostCount - Number of posts to make in the allotted time
 * @returns The calculated delay between posts in milliseconds
 */
export const calculatePostDelay = (
    todayPostCount: number,
    todayPostingQuota: number,
    timeAllotted: number,
    targetPostCount: number
): number => {

    // Check if today's post count exceeds the quota
    const remainingQuota = todayPostingQuota - todayPostCount;
    if (remainingQuota <= 0) {
        throw new Error("Post quota for the day exceeded.");
    }

    // Determine the actual number of posts to make (based on the lesser of remaining quota or target posts)
    const postsToMake = Math.min(targetPostCount, remainingQuota);

    // Calculate delay: distribute the time allotted across the number of posts to be made
    let postDelay = timeAllotted / postsToMake;

    return Math.round(postDelay);
};


// Function to format the date as mm/dd/yyyy hh:mm:ss
export const formatDateTime = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`; // Combined date and time
};


/**
 * Adds the specified milliseconds to the current time and returns the resulting time
 * in a human-readable 12-hour clock format.
 *
 * @param millisToAdd - The number of milliseconds to add to the current time.
 * @returns A string representing the time after adding the specified milliseconds,
 * formatted as "hh:mm:ss AM/PM".
 *
 * - Hours are converted to a 12-hour format (1-12).
 * - Minutes are zero-padded to ensure two digits.
 * - Seconds are zero-padded to ensure two digits.
 * - The string is suffixed with either "AM" or "PM" based on the time of day.
 */

export const clockTimeAfter = (millisToAdd: number): string => {
    const date = new Date(Date.now() + millisToAdd);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const sec = date.getSeconds();

    // Format hours and minutes
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero if needed
    const formattedSec = sec.toString().padStart(2, '0'); // Add leading zero if needed
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${formattedHours}:${formattedMinutes}:${formattedSec} ${ampm}`;
}


export const todayFullDate = (): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const today = new Date().toLocaleDateString('en-CA', options);
    return today.replace(/\//g, '-'); // Format: YYYY-MM-DD
}



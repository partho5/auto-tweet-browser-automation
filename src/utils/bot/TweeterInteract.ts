// TweeterInteract.ts

// Function to type a message into the Twitter text area
import {addOrSubtractRandomNumber, generateRandomNum} from "../formatter/Numbers";
import {generateContent} from "../data/PostContents";

const typeMessage = (text: string): void => {
    const textArea = document.querySelector('.DraftEditor-editorContainer .public-DraftEditor-content');
    if (textArea) {
        (textArea as HTMLElement).focus();
        document.execCommand('insertText', false, text);
    }
}

const clearPostField = (): void => {
    const textArea = document.querySelector('.DraftEditor-editorContainer .public-DraftEditor-content');
    if (textArea) {
        (textArea as HTMLElement).focus();
        document.execCommand('selectAll', false); // Selects all the text in the field
        document.execCommand('delete', false); // Deletes the selected text
    }
}

// Function to click the post button
const clickPostButton = (): void => {
    const postButton = document.querySelector('[data-testid="tweetButtonInline"]');
    if (postButton) {
        (postButton as HTMLElement).click();
    } else {
        console.log('Post button not found.');
    }
}

// Function to post a message with a delay
const postMessageWithDelay = (text: string, delay: number): void => {
    delay = addOrSubtractRandomNumber(delay);
    setTimeout(() => {
        console.log(`postDelay=${delay} - ${new Date()}`);
        typeMessage(text);

        // Add another delay before clicking the post button to ensure the text is typed
        setTimeout(() => {
            clickPostButton();
        }, 1000); // Delay for text to register before clicking
    }, delay);
}


const makePost = (): Promise<boolean> => {
    const msg = generateContent();
    return new Promise((resolve) => {
        if(msg){
            typeMessage(msg);
            const delay = generateRandomNum(1000, 3000); // 1 sec to 3 sec
            setTimeout(() => {
                //console.log(`Posted  at ${new Date().toLocaleString()}`);
                clickPostButton();
                resolve(true); // Resolve the promise with success (true)
            }, delay);
        }
    });
};


function dailyPostingQuotaExceeded(): boolean {
    const elements = document.querySelectorAll('div');

    for (const element of elements) {
        if (element.textContent?.includes("You are over the daily limit for sending posts")) {
            return true;
        }
    }

    return false;
}


function clearDailyLimitMessage(): void {
    try{
        // Select the specific span containing the message
        const messageElement = document.querySelector<HTMLSpanElement>('div.css-175oi2r.r-1habvwh.r-13awgt0.r-1777fci span.css-1jxf684');

        if (messageElement && messageElement.textContent?.includes("You are over the daily limit for sending posts")) {
            messageElement.textContent = ''; // Clear the content of the specific span
        }
    }catch (e){
        console.error("could not clear input field", e)
    }
}


// Function to clear the Twitter input field
function clearInputField(): void {
    try{
        // Select the content-editable input field by its data-testid attribute
        const tweetInputField = document.querySelector('div[contenteditable="true"][data-testid="tweetTextarea_0"]');

        // Clear the input field
        if (tweetInputField) {
            tweetInputField.innerHTML = ''; // Clear the content
        }
    }catch (e){
        console.error('could not clear field', e)
    }
}


export {
    postMessageWithDelay,
    typeMessage,
    clickPostButton,
    makePost,
    dailyPostingQuotaExceeded,
    clearDailyLimitMessage,
    clearInputField,
};

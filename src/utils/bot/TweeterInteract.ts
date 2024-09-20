// TweeterInteract.ts

// Function to type a message into the Twitter text area
import {addOrSubtractRandomNumber} from "../formatter/Numbers";

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


export {
    postMessageWithDelay,
    typeMessage,
    clickPostButton
};

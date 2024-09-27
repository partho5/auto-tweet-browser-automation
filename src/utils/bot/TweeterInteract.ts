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
    try {
        const textArea = document.querySelector('.DraftEditor-editorContainer .public-DraftEditor-content');
        if (textArea) {
            (textArea as HTMLElement).focus();
            document.execCommand('selectAll', false); // Selects all the text in the field
            document.execCommand('delete', false); // Deletes the selected text
            //console.log('clearPostField');
        }
    }catch (e){}
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

const makePost = async (): Promise<boolean> => {
    const msg = generateContent();
    return new Promise((resolve) => {
        if(msg){
            typeMessage(msg);

            //close link preview
            let delay = generateRandomNum(1000, 2500); // millisecond
            setTimeout(() => {
                closeLinkPreviewIfFound();
            }, delay);

            // click post button
            delay = generateRandomNum(2700, 3500);
            setTimeout(() => {
                //console.log(`${msg} - Posted  at ${new Date().toLocaleString()}`);
                clickPostButton();

                //here content duplicity warning may arise (in rare cases), so check for duplicity
                setTimeout(()=>{
                    if(duplicatePostContentDetected()){
                        // then write something
                        clearPostField();
                        setTimeout(()=>{
                            typeMessage(' . ');
                        }, 400);
                    }
                }, 300);

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


const duplicatePostContentDetected = () => {
    const textToFind = 'Whoops! You already said that.';
    const elements = document.body.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent?.includes(textToFind)) {
            return true;
        }
    }
    return false;
}


const clickLike = () => {
    try {
        const btn = document.querySelector('button[data-testid="like"]');
        if(btn){
            (btn as HTMLElement).click();
        }
    }catch (e){}
}

const closeLinkPreviewIfFound = () => {
    try {
        const button = document.querySelector('button[aria-label="Remove card preview"]');

        // Check if the button exists and then click it
        if (button) {
            (button as HTMLElement).click();
        } else {
            console.log('Link preview Button not found');
        }
    }catch (e){}
}

export {
    typeMessage,
    clickPostButton,
    makePost,
    dailyPostingQuotaExceeded,
    clearDailyLimitMessage,
    clearInputField,
    duplicatePostContentDetected
};

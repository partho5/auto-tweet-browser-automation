// utils/postContents.ts
import { formatDateTime } from "../time/TimeUtils";
import {link1, postSentence1, tickers, uniqueModifierChars} from "../../data/values";
import {setMsg} from "../ui/msgLog";

let postContentArray: string[] = [];
let lastUsedLineIndex: number = 0;

// Function to retrieve content from storage synchronously
const loadContentFromStorage = (): void => {
    chrome.storage.local.get(['content'], (items) => {
        if (items.content) {
            postContentArray = items.content;
        } else {
            console.log('No content found in storage');
            setMsg('No content found in storage')
        }

        chrome.storage.local.get(['lastUsedLine'], (result) => {
            lastUsedLineIndex = result.lastUsedLine || 0;
        });
    });
};

// Generates content, loading it first if necessary
// Generates content, loading it first if necessary
export const generateContent = (): string | null => {
    // Load content from storage, if it's empty
    if (postContentArray.length === 0) {
        loadContentFromStorage();
        console.log('loadContentFromStorage()');
    }

    if (postContentArray.length === 0) {
        return null; // Return null if still no content available
    }

    const selectedContent = postContentArray[lastUsedLineIndex];

    // console.log('postContentArray', postContentArray);
    // console.log('selectedContent', selectedContent);

    // Update the index for the next generated line
    lastUsedLineIndex = (lastUsedLineIndex + 1) % postContentArray.length;
    chrome.storage.local.set({ lastUsedLine: lastUsedLineIndex });
    //console.log('lastUsedLineIndex', lastUsedLineIndex);

    if (selectedContent) {
        return selectedContent;
    }
    return null;
};


const modifierChars = uniqueModifierChars;
// Take 1 to 3 chars from those
export const uniqueModifier = (): string[] => {
    const result: string[] = [];

    // Helper function to generate combinations
    const generateCombinations = (currentCombo: string, start: number) => {
        if (currentCombo.length > 0) {
            result.push(currentCombo);
        }

        // Generate combinations up to 3 modifiers
        if (currentCombo.length >= 3) {
            return;
        }

        for (let i = start; i < modifierChars.length; i++) {
            generateCombinations(currentCombo + modifierChars[i], i + 1);
        }
    };

    // Generate all combinations starting with each modifier
    for (let i = 0; i < modifierChars.length; i++) {
        generateCombinations(modifierChars[i], i + 1);
    }

    return result;
};


/*=========================================*/
const uniqueModifierCombinations = (arr: string[]): string[] => {
    const results: string[] = [];

    // Generate single character combinations
    for (let i = 0; i < arr.length; i++) {
        results.push(arr[i]);
    }

    // Generate two character combinations
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            results.push(arr[i] + arr[j]);
        }
    }

    // Generate three character combinations
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr.length; k++) {
                //results.push(arr[i] + arr[j] + arr[k]);
            }
        }
    }

    return results;
}


export const contentLines = (): string => {
    const uniqueChars = uniqueModifierCombinations(modifierChars);
    //console.log('uniqueChars', uniqueChars);

    // $ticker + sentence
    let contentArray = [];
    for (let i=0; i < tickers.length; i++){
        contentArray.push(`$${tickers[i]} ${postSentence1}`)
    }
    //console.log('contentArray', contentArray);

    // $ticker + sentence + unique modifier + link
    let content = '';
    for (let i = 0; i < uniqueChars.length; i++){
        for (let j=0; j < contentArray.length; j++){
            content = `${content}${contentArray[j]}${uniqueChars[i]} ${link1}\n`;
        }
    }

    return content;
}

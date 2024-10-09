// utils/postContents.ts
import { formatDateTime } from "../time/TimeUtils";
import {link1, postSentence1, tickers, uniqueModifierChars} from "../../data/values";
import {setMsg} from "../ui/msgLog";

let postContentArray: string[] = [];
let lastUsedLineIndex: number = 0;

// Function to retrieve content from storage synchronously
const loadContentFromStorage = async (): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['content'], (items) => {
            if (items.content) {
                postContentArray = items.content;
            } else {
                console.log('No content found in storage');
                setMsg('No content found in storage');
            }

            chrome.storage.local.get(['lastUsedLine'], (result) => {
                lastUsedLineIndex = result.lastUsedLine || 0;
                resolve(); // Resolve the promise after loading
            });
        });
    });
};

// Generates content, loading it first if necessary
export const generateContent = async (): Promise<string | null> => {
    // Load content from storage, if it's empty
    if (postContentArray.length === 0) {
        await loadContentFromStorage();
        console.log('loadContentFromStorage()');
    }

    if (postContentArray.length === 0) {
        return null; // Return null if still no content available
    }

    const selectedContent = postContentArray[lastUsedLineIndex];

    // Update the index for the next generated line. If reached last line, set to first line again
    lastUsedLineIndex = (lastUsedLineIndex + 1) % postContentArray.length;
    chrome.storage.local.set({ lastUsedLine: lastUsedLineIndex });

    if (selectedContent) {
        return selectedContent;
    }
    return null;
};


const modifierChars = uniqueModifierChars;

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


export const stockSymbolsContentWithLink = async (tickers: String[]): Promise<string> => {
    const uniqueChars = uniqueModifierCombinations(modifierChars);
    // console.log('uniqueChars', uniqueChars);

    // $ticker + sentence
    let contentArray = [];
    for (let i=0; i < tickers.length; i++){
        contentArray.push(`$${tickers[i]} ${postSentence1}`)
    }
    // console.log('contentArray', contentArray);

    let content = '';

    // First, generate combinations without appending any uniqueChars
    for (let j = 0; j < contentArray.length; j++) {
        content = `${content}${contentArray[j]} ${link1}\n`;
    }

    // Now, generate combinations with uniqueChars.
    // $ticker + sentence + unique modifier + link
    for (let i = 0; i < uniqueChars.length; i++) {
        for (let j = 0; j < contentArray.length; j++) {
            content = `${content}${contentArray[j]}${uniqueChars[i]} ${link1}\n`;
        }
    }

    return content;
}

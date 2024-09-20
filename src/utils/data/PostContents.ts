// utils/postContents.ts
import { formatDateTime } from "../time/TimeUtils";
import {uniqueModifierChars} from "../../data/values";

let postContentArray: string[] = [];
let lastUsedLineIndex: number = 0;
let lastUsedModifierIndex: number = 0;

// Function to retrieve content from storage synchronously
const loadContentFromStorage = (): void => {
    chrome.storage.local.get(['content'], (items) => {
        if (items.content) {
            postContentArray = items.content;
        } else {
            console.log('No content found in storage.');
        }

        chrome.storage.local.get(['lastUsedLine', 'lastUsedModifier'], (result) => {
            lastUsedLineIndex = result.lastUsedLine || 0;
            lastUsedModifierIndex = result.lastUsedModifier || 0;
        });
    });
};

// Generates content, loading it first if necessary
export const generateContent = (): string | null => {
    // Load content if it's empty
    if (postContentArray.length === 0) {
        loadContentFromStorage();
    }

    if (postContentArray.length === 0) {
        return null; // Return null if still no content available
    }

    //console.log('postContentArray', postContentArray);

    const selectedContent = postContentArray[lastUsedLineIndex];

    lastUsedLineIndex = (lastUsedLineIndex + 1) % postContentArray.length;
    chrome.storage.local.set({ lastUsedLine: lastUsedLineIndex });

    const modifiers = uniqueModifier();
    const selectedModifier = modifiers[lastUsedModifierIndex];

    lastUsedModifierIndex = (lastUsedModifierIndex + 1) % modifiers.length;
    chrome.storage.local.set({ lastUsedModifier: lastUsedModifierIndex });

    if(selectedContent){
        return `${selectedContent} ${selectedModifier}`;
    }
    return null;
};


const modifierChars = uniqueModifierChars;
// Take 1 to 3 chars from those
const uniqueModifier = (): string[] => {
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


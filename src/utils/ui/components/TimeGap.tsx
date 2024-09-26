import React, { useState, useEffect } from 'react';
import './TimeGap.css'
import {showPopupMessage} from "./notifications/showPopupMessage";
import {defaultPostingGapMax, defaultPostingGapMin} from "../../../data/values";

const TimeGap: React.FC = () => {
    const [minGap, setMinGap] = useState<string>('');
    const [maxGap, setMaxGap] = useState<string>('');

    // Retrieve saved values from Chrome extension local storage
    useEffect(() => {
        const getSavedGaps = async () => {
            const result = await chrome.storage.local.get(['minGap', 'maxGap']);
            if (result.minGap) setMinGap(result.minGap);
            if (result.maxGap) setMaxGap(result.maxGap);
        };
        getSavedGaps();
    }, []);

    // Save values to Chrome extension local storage
    useEffect(() => {
        chrome.storage.local.set({ minGap, maxGap });
    }, [minGap, maxGap]);

    // min value must be < max value
    useEffect(() => {
        if (parseInt(minGap) >= parseInt(maxGap) && minGap !== '' && maxGap !== '') {
            showPopupMessage('<u>Posting Time Gap</u>: Maximum value must be greater than minimum value.', 'error');
        } else {

        }
    }, [minGap, maxGap]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinGap(e.target.value);
        showPopupMessage('Time gap saved', 'success')
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxGap(e.target.value);
        showPopupMessage('Time gap saved', 'success')
    }

    return (
        <div className="time-gap-container">
            <h4>Posting Time Gap</h4>
            <p className="hints">
                To avoid bot detection, set a random time gap between postings. The delay will be randomly chosen from
                the minimum and maximum values.
            </p>
            <div className="input-group-wrapper">
                <div className="input-group">
                    <label htmlFor="min-gap">Minimum Gap (in seconds)</label>
                    <input
                        type="number"
                        id="min-gap"
                        min={5}
                        max={60*6}
                        value={minGap}
                        onChange={handleMinChange}
                        placeholder="Enter minimum gap"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="max-gap">Maximum Gap (in seconds)</label>
                    <input
                        type="number"
                        id="max-gap"
                        min={6}
                        max={60*6}
                        value={maxGap}
                        onChange={handleMaxChange}
                        placeholder="Enter maximum gap"
                    />
                </div>
            </div>

        </div>
    );
};

export default TimeGap;

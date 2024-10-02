import React, { useState, useEffect } from 'react';
import './TimeGap.css'
import {hidePopupMsg, showPopupMessage} from "./notifications/showPopupMessage";
import {defaultPostingGapMax, defaultPostingGapMin} from "../../../data/values";

const TimeGap: React.FC = () => {
    const [minGap, setMinGap] = useState<string>(String(defaultPostingGapMin));
    const [maxGap, setMaxGap] = useState<string>(String(defaultPostingGapMax));

    // Retrieve saved values from Chrome extension local storage
    useEffect(() => {
        chrome.storage.local.get(['minGap', 'maxGap'], (result) => {
            if (result.minGap !== undefined && result.maxGap !== undefined && result.minGap !== '' && result.maxGap !== '') {
                console.log("minGap maxGap has value", result);
                setMinGap(result.minGap);
                setMaxGap(result.maxGap);
            } else {
                console.log("minGap or maxGap not set", result.minGap, result.maxGap);
                // Default values are already set in state initialization
            }
        });
    }, []);


    // min value must be < max value
    useEffect(() => {
        if (minGap === '' || maxGap === '' || parseInt(minGap) >= parseInt(maxGap)) {
            //console.log('min < max -false')
            showPopupMessage('<u>Posting Time Gap</u>: Maximum value must be greater than minimum value.', 'error');
        } else {
            hidePopupMsg('error')
            //console.log('min < max -OK')
        }
    }, [minGap, maxGap]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinGap(e.target.value);
        chrome.storage.local.set({ minGap: e.target.value });
        showPopupMessage('Time gap saved', 'success')
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxGap(e.target.value);
        chrome.storage.local.set({ maxGap: e.target.value });
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
                    <label htmlFor="min-gap">Minimum Gap</label>
                    <input
                        type="number"
                        id="min-gap"
                        min={5}
                        max={3600}
                        value={minGap}
                        onChange={handleMinChange}
                        placeholder="Enter minimum gap"
                    />
                    <span>seconds</span>
                </div>
                <div className="input-group">
                    <label htmlFor="max-gap">Maximum Gap</label>
                    <input
                        type="number"
                        id="max-gap"
                        min={parseInt(minGap)+1} // set 1 more than minimum value
                        max={3600*4}
                        value={maxGap}
                        onChange={handleMaxChange}
                        placeholder="Enter maximum gap"
                    />
                    <span>seconds</span>
                </div>
            </div>

        </div>
    );
};

export default TimeGap;

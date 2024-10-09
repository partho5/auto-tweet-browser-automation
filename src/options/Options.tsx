import React, { useState, useEffect } from 'react';
import './Options.css';
import { appName } from "../data/values";
import TimeGap from "../utils/ui/components/TimeGap";
import {showPopupMessage} from "../utils/ui/components/notifications/showPopupMessage";
import PackageChanger from "../utils/ui/components/PackageChanger";
import ActivityTabs from "../utils/ui/components/ActivityTabs";
import {stockSymbolsContentWithLink1} from "../utils/data/PostContents";

// Define the types for saved content
interface StoredContent {
    content: string[];
}

export const Options: React.FC = () => {
    const [postContent, setPostContent] = useState<string>('');

    // Handle changes in the textarea
    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };


    // Save the content to Chrome's local storage as an array of lines
    const saveContent = () => {
        const trimmedContent = postContent.trim(); // Trim the content to remove leading/trailing spaces

        // Early return if no content
        if (!trimmedContent) {
            showPopupMessage('Please write some content', 'error');
            return;
        }

        const contentArray = trimmedContent.split('\n').filter(line => line.trim() !== ''); // Split and remove empty lines
        const contentString = contentArray.join('\n'); // Convert back to string

        setPostContent(contentString); // Update the textarea with formatted content

        if (contentArray.length > 0) {
            chrome.storage.local.set({ content: contentArray }, () => {
                showPopupMessage('Content Saved', 'success');
            });
        } else {
            showPopupMessage('Please write some content', 'error');
        }
    };



    // Retrieve the content from Chrome's local storage
    const retrieveContent = () => {
        chrome.storage.local.get(['content'], (items) => {
            if (items.content) {
                setPostContent(items.content.join('\n')); // Join the array back into a string
            } else {
                //console.log('No content found');
            }
        });
    };

    // Retrieve content when the component mounts
    useEffect(() => {
        retrieveContent();
    }, []);

    const fetchStockSymbols = async () => {
        const apiUrl = `https://apps.jovoc.com/fetch/monday`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();  // Convert response to JSON
            return data?.tickers;  // Return the tickers
        } catch (error) {
            console.error('Error:', error);  // Handle errors if any
            return null;  // Return null or handle error state accordingly
        }
    };

    const forgeContent = async () => {
        try {
            const tickersString = await fetchStockSymbols(); // Assuming it returns a string
            // If tickersString is null, handle appropriately
            if (tickersString) {
                // Convert the comma-separated string to an array
                const tickersArray = tickersString
                    .split(',')
                    .map((ticker: string) => ticker.trim()); // Trim any whitespace
                if (Array.isArray(tickersArray) && tickersArray.length > 0) {
                    const content = await stockSymbolsContentWithLink1(tickersArray); // Pass the array to the function
                    console.log(content);
                    setPostContent(content)
                } else {
                    console.error('No tickers fetched or tickers is not an array');
                }
            } else {
                console.error('Failed to fetch tickers or tickers is null');
            }
        } catch (error) {
            console.error('Error while fetching symbols or generating content:', error);
        }
    };

    const copyContent = () => {

    }


    // @ts-ignore
    return (
        <main>
            <section className="content">
                <h3>{appName} Settings</h3>

                <div className="row content-to-post">
                    <h4>Content to Post</h4>
                    <div className="hints">
                        Write post content, each in a separate line
                    </div>
                    <div className="">
                        <textarea
                            value={postContent}
                            onChange={handlePostContentChange}
                        ></textarea>
                    </div>
                    <div className="btn-container">
                        <button onClick={saveContent} className="btn btn-save" style={{backgroundColor: 'green'}}>💾 Save Content</button>
                    </div>
                </div>

                <div className="row time-gap">
                    <TimeGap/>
                </div>

                <div className="row packages" style={{display: "none"}}>
                    <h4>My Plans</h4>
                    <div className="hints">
                        Change Plan anytime, cancel anytime
                    </div>
                    <div className="content">
                        <div>
                            Active Plan : <span className="plan-name active">Free</span>
                        </div>
                        <div className="btn-container">
                            <PackageChanger/>
                        </div>
                    </div>
                </div>

                <div className="row content-maker">
                    <h4>Content Builder</h4>
                    <div className="hints">
                        Make content out of the box. Save hours
                    </div>
                    <div className="tabs-container">
                        <ActivityTabs/>
                    </div>
                    <div className="btn-container">
                        <button onClick={forgeContent} className="btn btn-save" style={{backgroundColor: '#9C27B0'}}>🛠️ Make Content</button> &nbsp;
                        <button onClick={copyContent} className="btn btn-save" style={{backgroundColor: '#000'}}>📜 Copy</button>
                    </div>
                </div>

                {/*<div className="row">*/}
                {/*    <button onClick={handleAPIcall}>API call</button>*/}
                {/*</div>*/}

                <div className="row links">
                    <p className="developer">
                        Developed by:
                        <a href="https://www.linkedin.com/in/partho5" target="_blank" rel="noreferrer">Partho Protim</a>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Options;

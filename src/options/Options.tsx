import React, { useState, useEffect } from 'react';
import './Options.css';
import { appName } from "../data/values";
import TimeGap from "../utils/ui/components/TimeGap";
import {showPopupMessage} from "../utils/ui/components/notifications/showPopupMessage";
import PackageChanger from "../utils/ui/components/PackageChanger";

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
        const contentArray = postContent.split('\n').filter(line => line.trim() !== ''); // Split content and remove empty lines
        chrome.storage.local.set({ content: contentArray }, () => {
            //console.log('Content saved successfully!');
            showPopupMessage('Content Saved', 'success');
        });

        // again convert back to string and set in textarea field
        const contentString = contentArray.join('\n');
        setPostContent(contentString);
    };

    // Retrieve the content from Chrome's local storage
    const retrieveContent = () => {
        chrome.storage.local.get(['content'], (items) => {
            if (items.content) {
                setPostContent(items.content.join('\n')); // Join the array back into a string
            } else {
                console.log('No content found');
            }
        });
    };

    // Retrieve content when the component mounts
    useEffect(() => {
        retrieveContent();
    }, []);

    const handleAPIcall = () => {
        const apiUrl = `https://jovoc.com/api/...`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
            },
        })
            .then((response) => {
                return response.json();  // Convert response to JSON
            })
            .then((data) => {
                console.log('isVerified=', data?.isVerified);  // Use the actual parsed data
            })
            .catch((error) => {
                console.error('Error:', error);  // Handle errors if any
            });
    };


    // @ts-ignore
    return (
        <main>
            <section className="content">
                <h3>{appName}</h3>

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
                        <button onClick={saveContent} className="btn btn-save">Save Content</button>
                    </div>
                </div>

                <div className="row time-gap">
                    <TimeGap/>
                </div>

                <div className="row packages">
                    <h4>My Plans</h4>
                    <div className="hints">
                        Change Plan anytime, cancel anytime
                    </div>
                    <div className="content">
                        <div>
                            Active Plan : <span className="plan-name active">Free</span>
                        </div>
                        <div className="btn-container">
                            <PackageChanger />
                        </div>
                    </div>
                </div>

                {/*<div className="row">*/}
                {/*    <button onClick={handleAPIcall}>API call</button>*/}
                {/*</div>*/}

                <div className="row links">
                    <p className="developer">
                        Developed by: <a href="https://www.linkedin.com/in/partho5" target="_blank" rel="noreferrer">Partho
                        Protim</a>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Options;

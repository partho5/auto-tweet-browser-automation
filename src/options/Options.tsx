import React, { useState, useEffect } from 'react';
import './Options.css';
import { appName } from "../data/values";

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
        const contentArray = postContent.split('\n'); // Split content by new lines
        chrome.storage.local.set({ content: contentArray }, () => {
            console.log('Content saved successfully!');
        });
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

                <div className="row links">
                <p className="developer">
                        Developed by: <a href="https://www.linkedin.com/in/partho5" target="_blank" rel="noreferrer">Partho Protim</a>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Options;

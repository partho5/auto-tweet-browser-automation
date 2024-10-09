import React, { useState } from 'react';
import './ActivityTabs.css'; // Import the CSS file for styling

// Define a type for our tab data
interface Tab {
    label: string;
    content: string;
}

// Sample data for tabs
let tabData: Tab[] = [
    { label: 'Trading Content', content: 'Content pattern will be shown here' },
];

// Tab component
const Tab: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => {
    return (
        <div className={`tab ${isActive ? 'active' : ''}`} onClick={onClick}>
            {label}
        </div>
    );
};

// Main Tabs Component
const Tabs: React.FC = () => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0); // Start with the first tab

    const handleTabClick = (index: number) => {
        setActiveTabIndex(index);
    };

    const renderContent = () => {
        return `${tabData[activeTabIndex].content}`;
    };

    return (
        <div className="tabs-container">
            <div className="tabs">
                {tabData.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        isActive={activeTabIndex === index}
                        onClick={() => handleTabClick(index)}
                    />
                ))}
            </div>
            <div className="tab-content" id="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Tabs;
import React, { useState } from 'react';
import './PackageChanger.css';

const PackageChanger = () => {

    // Function to handle the upgrade button click
    const handleUpgradeClick = () => {
        // You can add the actual logic to upgrade the package here, like API call
    };

    return (
        <>
            <a href="http://127.0.0.1:8000/plans/choose?appCode=TW_BOT_AUTO_POST" target="_blank">
                <button
                    className="btn-action"
                    onClick={handleUpgradeClick}>
                    Upgrade
                </button>
            </a>
        </>
    );
};

export default PackageChanger;

import './showPopupMessage.css';

type MessageType = 'default' | 'success' | 'error';

export const showPopupMessage = (html: string, type: MessageType = 'default') => {
    // Check for existing message of the same type
    const existingMessage = document.querySelector(`.message-box.${type}`);
    if (existingMessage) {
        // Replace the existing message content
        const messageContent = existingMessage.querySelector('.message-content');
        if (messageContent) {
            messageContent.innerHTML = html;
            existingMessage.classList.remove('fade-out'); // Reset fade-out
            existingMessage.classList.add('fade-in'); // Reapply fade-in
        }
        return; // Exit early if replacing
    }


    // Create the message container
    const message = document.createElement('div');
    message.classList.add('message-box', type);
    message.innerHTML = `
        <div class="message-content">${html}</div>
        <button class="message-close">&times;</button>
    `;

    // Prepend to the body or a parent container
    document.body.prepend(message);

    // Apply fade-in and scale-up animation
    requestAnimationFrame(() => {
        message.classList.add('fade-in');
        setTimeout(() => {
            message.classList.add('fade-out');
        }, 10*1000);
    });

    // Handle close button click
    const closeButton = message.querySelector('.message-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            // Apply fade-out and scale-down animation
            message.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300); // Match this with the duration of the fade-out animation
        });
    }
};


export const hidePopupMsg = (type: MessageType) => {
    const message = document.querySelector(`.message-box.${type}`);
    if (message) {
        // Apply fade-out animation
        message.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300); // Match this with the duration of the fade-out animation
    }
};

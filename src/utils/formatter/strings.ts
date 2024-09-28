
const tweeterCharLimitNotExceeded = (text: string) => {
    return text.length <= 279-5; // minus 5 for more safety :D
}

export const removeEmptyLines = (content: string) => {
    return content.split('\n').filter(line => line.trim() !== '');
};

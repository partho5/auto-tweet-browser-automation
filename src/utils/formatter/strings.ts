
const tweeterCharLimitNotExceeded = (text: string) => {
    return text.length <= 279-5; // minus 5 for more safety :D
}

export {
    tweeterCharLimitNotExceeded
};

// Generate a random number between min (inclusive) and max (exclusive)
const generateRandomNum = (min: number, max: number): number => {
    // Ensure that min is less than max
    if (min >= max) {
        throw new Error("Minimum value must be less than maximum value.");
    }

    // Generate a random number between min (inclusive) and max (exclusive)
    return Math.floor(Math.random() * (max - min)) + min;
}

const randomMillis = (min: number, max: number) =>{
    console.log('min', min, 'max', max)
    const factor = 1000;
    return generateRandomNum(min*factor, max*factor);
}

function addOrSubtractRandomNumber(inputNum: number): number {
    const rand = generateRandomNum(5*1000, 20*1000); // 5 sec to 20 sec

    // Randomly decide to make the adjustment positive or negative
    const adjustment = Math.random() < 0.5 ? rand : -rand;
    return inputNum + adjustment;
}


export {
    generateRandomNum,
    addOrSubtractRandomNumber,
    randomMillis
};

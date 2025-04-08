function generateRandomName(prefix = '') {
    const randomString = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${randomString}` : randomString;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomWitnessData() {
    return {
        prefix: '',
        firstName: generateRandomName('FN'),
        middleName: '',
        lastName: generateRandomName('Auto'),
        suffix: '',
        expertise: ''
    };
}

module.exports = {
    generateRandomName,
    wait,
    generateRandomWitnessData
};
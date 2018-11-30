module.exports = {
    FirstLetterUpperCase: (userName) => {
        let name = userName.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    allLowerCase: (sentence) => {
        return sentence.toLowerCase();
    }
};
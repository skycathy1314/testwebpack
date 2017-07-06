const config = require('../config.json');
const style = require('../css/Greeter.css');

module.exports = function() {
    var greet = document.createElement('div');
    greet.classList.add(style.root);
    greet.textContent = config.greetText;
    return greet;
};
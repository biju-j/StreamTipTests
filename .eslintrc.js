module.exports = {
    "env": {
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4, {"SwitchCase": 1} ],
        "linebreak-style": ["warn", "unix"],
        "semi": ["error", "always"],
        "quotes": ["error", "single", "avoid-escape"],
        "no-console": "off"
    }
};
module.exports = {
  "extends": "google",
  "env": {
    "node": true,
    "mocha": true
  },
  "rules": {
    "prefer-const": ["error"],
    "semi": [2, "never"],
    "no-multiple-empty-lines": [0],
    "new-cap": [2, {
      "capIsNewExceptions": ["DataTypes.ARRAY", "DataTypes.STRING", "Sequelize.ARRAY", "Sequelize.STRING", "DataTypes.ENUM", "Sequelize.ENUM", "s3Stream.WriteStream"]
    }],
    "max-len": [2, 120, 4],
    "no-var": [2],
    "require-jsdoc": [0],
    "generator-star-spacing": [2, {"before": true, "after": false}],
    "quotes": [2, "single"],
    "strict": ["error", "global"]
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script"
  }
};

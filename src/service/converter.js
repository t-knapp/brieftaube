const { exec } = require('child_process');

const convert = function(inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        exec(`msgconvert --outfile ${outputFilePath} ${inputFilePath}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                reject();
            }
            resolve();
        });
    });
};

module.exports = convert;
const path = require('path');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');

const convert = require('./service/converter');
const randomString = require('./helper/helper');
const Paths = require('./service/paths');

const port = 3000;

const paths = new Paths('/tmp/brieftaube/');

const app = express();

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : paths.getUploadPath()
}));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    const sourceFilePath = paths.getPendingPath(randomString(16));
    const destFilePath = paths.getDonePath(`${sampleFile.name}.eml`);
    sampleFile.mv(sourceFilePath, async (mvError) => {
        if (mvError)
            return res.status(500).send(mvError);

        await convert(sourceFilePath, destFilePath);

        res.download(destFilePath, (err) => {
            if(err)
                console.error('Error:', err);
            else {
                fs.unlinkSync(sourceFilePath);
                fs.unlinkSync(destFilePath);
            } 
        });
    });
});

app.listen(port, () => console.log(`brieftaube listens on port ${port}!`));
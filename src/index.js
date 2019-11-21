const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const convert = require('./service/converter');

const port = 3000;

const app = express();
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/brieftaube/'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    const sourceFilePath = `/tmp/brieftaube/pending/${makeid(16)}`;
    const destFilePath = `/tmp/brieftaube/done/${sampleFile.name}.eml`;
    sampleFile.mv(sourceFilePath, async (mvError) => {
        if (mvError)
            return res.status(500).send(mvError);

        await convert(sourceFilePath, destFilePath);

        res.download(destFilePath, (err) => {
            if(err)
                console.error('Error:', err);
        });
    });
});

app.listen(port, () => console.log(`brieftaube listens on port ${port}!`))

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
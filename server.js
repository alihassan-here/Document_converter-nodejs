const { PDFNet } = require('@pdftron/pdfnet-node');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/generateInvoices', (req, res) => {
    const inputPath = path.resolve(__dirname, './files/sample1.pdf');
    const outputPath = path.resolve(__dirname, './files/output.pdf');
    const replaceText = async () => {
        const pdfDoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
        await pdfDoc.initSecurityHandler();
        const replacer = await PDFNet.ContentReplacer.create(pdfDoc);
        const page = await pdfDoc.getPage(1);
    }

});

app.get('/convertFromOffice', (req, res) => {
    const { filename } = req.query;
    const inputPath = path.resolve(__dirname, `./files/${filename}`);
    const outputPath = path.resolve(__dirname, `./files/${filename}.pdf`);
    const convertToPDF = async () => {
        const pdfdoc = await PDFNet.PDFDoc.create();
        await pdfdoc.initSecurityHandler();
        await PDFNet.Convert.toPdf(pdfdoc, inputPath);
        await pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    }
    PDFNet.runWithCleanup(convertToPDF, 'demo:1651053939081:7ba76ece03000000007bd593759be832a60ea1ced19dba5e3d37538799').then(() => {
        fs.readFile(outputPath, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.contentType('application/pdf');
                res.send(data);
            }
        });
    }
    ).catch(err => {
        console.log(err);
        res.status(500).send(err);
    }
    );
});

app.listen(4000, () => {
    console.log('Server is running on port 3000');
});
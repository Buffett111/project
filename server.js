const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const libxmljs = require('libxmljs2');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Validation Route
app.post('/validate', (req, res) => {
    const { xmlContent, xsdContent } = req.body;

    try {
        const xsdDoc = libxmljs.parseXml(xsdContent);
        const xmlDoc = libxmljs.parseXml(xmlContent);
        const isValid = xmlDoc.validate(xsdDoc);

        if (isValid) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false, errors: xmlDoc.validationErrors });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

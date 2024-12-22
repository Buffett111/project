
function loadAndRenderXML() {
    const xmlInput = document.getElementById("xmlFile").files[0];

    if (!xmlInput) {
        alert("請上傳 XML 文件");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const xmlContent = reader.result;

        // 解析 XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

        // 顯示 XML 原始碼
        displayXMLSource(xmlContent);

        // 自動生成 XSL
        const xslContent = generateXSL(xmlDoc);

        // 解析生成的 XSL
        const xslDoc = parser.parseFromString(xslContent, "application/xml");
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);

        // 轉換 XML 為 HTML
        const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        const iframe = document.getElementById("data-view");
        iframe.contentDocument.body.innerHTML = "";
        iframe.contentDocument.body.appendChild(resultDocument);
    };
    reader.readAsText(xmlInput);
}

// 顯示 XML 原始碼
function displayXMLSource(xmlContent) {
    const preElement = document.getElementById("xml-source");
    preElement.textContent = xmlContent;
}

// 自動生成 XSL 文件
function generateXSL(xmlDoc) {
    const rootElement = xmlDoc.documentElement;
    const childNodes = rootElement.children;

    // 開始生成 XSL 標籤
    let xslContent = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <body>
                <h2>${rootElement.nodeName} Data</h2>
                <table border="1">
                    <tr>`;

    // 生成表頭
    for (let i = 0; i < childNodes[0].children.length; i++) {
        xslContent += `<th>${childNodes[0].children[i].nodeName}</th>`;
    }

    xslContent += `</tr>
                    <xsl:for-each select="${rootElement.nodeName}/*">
                        <tr>`;

    // 生成數據行
    for (let i = 0; i < childNodes[0].children.length; i++) {
        xslContent += `<td><xsl:value-of select="${childNodes[0].children[i].nodeName}"/></td>`;
    }

    xslContent += `</tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;

    return xslContent;
}

async function validateXML() {
    const xmlInput = document.getElementById("xmlFile").files[0];
    const xsdInput = document.getElementById("xsdFile").files[0];

    if (!xmlInput || !xsdInput) {
        alert("請上傳 XML 和 XSD 文件進行驗證！");
        return;
    }

    const xmlContent = await readFileAsText(xmlInput);
    const xsdContent = await readFileAsText(xsdInput);

    try {
        // Send data to backend
        const response = await fetch("http://localhost:3000/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ xmlContent, xsdContent })
        });

        const result = await response.json();

        if (result.valid) {
            alert("XML 文件通過 XSD 驗證！");
        } else {
            console.error(result.errors);
            alert("XML 文件未通過 XSD 驗證！請檢查結構或數據格式。");
        }
    } catch (error) {
        console.error("驗證過程中出現錯誤:", error);
        alert("XML 驗證失敗！");
    }
}



// 使用 JavaScript 文件讀取器
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// 使用第三方庫 libxmljs2 進行驗證
function validateXMLWithXSD(xmlContent, xsdContent) {
    try {
        const libxmljs = require('libxmljs2'); // 確保頁面或環境中支持該庫
        const xsdDoc = libxmljs.parseXml(xsdContent);
        const xmlDoc = libxmljs.parseXml(xmlContent);

        return xmlDoc.validate(xsdDoc);
    } catch (error) {
        console.error("驗證過程中出現錯誤:", error);
        return false;
    }
}

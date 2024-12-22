let xmlDoc;

function addOrUpdateBook() {
    const id = document.getElementById("bookId").value;
    const title = document.getElementById("bookTitle").value;
    const category = document.getElementById("bookCategory").value;
    const author = document.getElementById("bookAuthor").value;
    const price = document.getElementById("bookPrice").value;

    if (!xmlDoc) xmlDoc = new DOMParser().parseFromString("<books></books>", "application/xml");

    const existingBook = Array.from(xmlDoc.getElementsByTagName("book")).find(book => book.getAttribute("id") === id);

    if (existingBook) {
        //check if user really wants to update the book
        if (!confirm("此書籍已經存在，確定要更新書籍嗎？")) return;

        existingBook.getElementsByTagName("title")[0].textContent = title;
        existingBook.getElementsByTagName("category")[0].textContent = category;
        existingBook.getElementsByTagName("author")[0].textContent = author;
        existingBook.getElementsByTagName("price")[0].textContent = price;
        alert("書籍已更新！");
    } else {
        //check if  bookid is empty
        if (!id) {
            alert("書籍編號不可為空！");
            return;
        }
        const book = xmlDoc.createElement("book");
        book.setAttribute("id", id);
        book.innerHTML = `
            <title>${title}</title>
            <category>${category}</category>
            <author>${author}</author>
            <price>${price}</price>
        `;
        xmlDoc.documentElement.appendChild(book);
        alert("書籍已新增！");
    }
    displayBooks();
}

function getBook() {
    const id = document.getElementById("bookId").value;
    const title = document.getElementById("bookTitle").value;
    const category = document.getElementById("bookCategory").value;
    const author = document.getElementById("bookAuthor").value;
    const price = document.getElementById("bookPrice").value;

    const books = Array.from(xmlDoc.getElementsByTagName("book")).filter(book => {
        return (!id || book.getAttribute("id") === id) &&
               (!title || book.getElementsByTagName("title")[0].textContent.includes(title)) &&
               (!category || book.getElementsByTagName("category")[0].textContent.includes(category)) &&
               (!author || book.getElementsByTagName("author")[0].textContent.includes(author)) &&
               (!price || book.getElementsByTagName("price")[0].textContent === price);
    });

    if (books.length > 0) {
        const rows = books.map(book => `
            <tr>
                <td>${book.getAttribute("id")}</td>
                <td>${book.getElementsByTagName("title")[0].textContent}</td>
                <td>${book.getElementsByTagName("category")[0].textContent}</td>
                <td>${book.getElementsByTagName("author")[0].textContent}</td>
                <td>${book.getElementsByTagName("price")[0].textContent}</td>
            </tr>
        `).join("");
        document.querySelector("#bookTable2 tbody").innerHTML = rows;
        //自動跳轉至最下方
        document.querySelector("#bookTable2").scrollIntoView();
        alert(`找到 ${books.length} 本書籍。`);
    } else {
        alert("找不到符合條件的書籍！");
    }
}

function deleteBook() {
    const id = document.getElementById("bookId").value;

    const book = Array.from(xmlDoc.getElementsByTagName("book")).find(book => book.getAttribute("id") === id);
    if (book) {
        xmlDoc.documentElement.removeChild(book);
        alert("書籍已刪除！");
    } else {
        alert("找不到指定書籍！");
    }
    displayBooks();
}

function queryBooks() {
    const rows = Array.from(xmlDoc.getElementsByTagName("book")).map(book => `
        <tr>
            <td>${book.getAttribute("id")}</td>
            <td>${book.getElementsByTagName("title")[0].textContent}</td>
            <td>${book.getElementsByTagName("category")[0].textContent}</td>
            <td>${book.getElementsByTagName("author")[0].textContent}</td>
            <td>${book.getElementsByTagName("price")[0].textContent}</td>
        </tr>
    `).join("");
    document.querySelector("#bookTable tbody").innerHTML = rows;
}

function importXML() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xml";
    fileInput.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            xmlDoc = new DOMParser().parseFromString(reader.result, "application/xml");
            displayBooks();
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

function exportXML() {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    const blob = new Blob([xmlString], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "books.xml";
    a.click();
}

function exportQueryResults() {
    const rows = document.querySelector("#bookTable2 tbody").innerHTML;
    if (!rows) {
        alert("沒有查詢結果可供匯出！");
        return;
    }

    const reportContent = `
        <html>
        <head><title>書籍查詢報告</title></head>
        <body>
            <table border="1">
                <thead>
                    <tr>
                        <th>書籍編號</th>
                        <th>書名</th>
                        <th>類別</th>
                        <th>作者</th>
                        <th>價錢</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([reportContent], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report.html";
    a.click();
}

function displayBooks() {
    if (!xmlDoc) return;
    queryBooks();
}

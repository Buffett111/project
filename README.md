
# XML動態網頁實習-書籍管理系統實作報告
## 資工115林宏昀 學號:41147004S
---

### 實作說明

#### **系統概述**

書籍管理系統是一個基於前端的專屬工具。使用HTML設計主畫面、JavaScript實現書籍的新增、修改、刪除、查詢和XML的匯入與匯出功能。
試著以XML文件來扮演資料庫的角色
但若需使用 xsd格式檢察功能則需使用node.js啟動後端程式具體說明可以參考尾端的安裝說明



#### **重要檔案概述**

1. **index.html**:

   - XML Viewer主畫面，提供文件的上傳和檢測功能，以及連結到書籍管理系統。

2. **editbook.html**:

   - 書籍管理頁面，包含書籍的新增、修改、刪除、查詢和XML匯入與匯出功能。

3. **editbook.js**:

   - 對應功能進行操作的JavaScript進行定義，如新增書籍、刪除書籍，查詢書籍等。

4. **viewer.js**:

   - 基於現有的XML實現檢測和渲染功能，並能自動生成XSL來顯示。

5. **server.js後端實現**:

   - 使用`libxmljs2`進行XML與XSD驗證，確保上傳文件符合結構要求。
   - 提供一個簡單的API，供前端傳送XML與XSD進行驗證並返回結果。

#### **實作功能說明**

1. **XML文件的匯入與匯出**

   - 匯入：使用 FileReader 讀取上傳的XML文件並轉換成html表格顯示。
   - 匯出：將目前表格中的書籍資料以XML格式存儲。

2. **書籍管理功能**

   - 新增書籍：根據輸入增加書籍資料，並核查ID單一性。
   - 修改書籍：根據查詢結果更新資料。
   - 刪除書籍：根據ID刪除指定書籍。
   - 提供預設的books.xsd檔案供使用者檢測自己的xml是否符合格式

3. **查詢與判斷**

   - 能夠根據書籍各個屬性查詢相關資料，並可以用表格形式展示結果。
   - 查詢結果顯示於下方表格，並自動捲動到結果區域。
   - 支援結果匯出、能夠將查詢結果匯出成report.html並供使用者下載。

4. **XSL自動生成**

   - 基於XML文件的結構自動生成XSL樣式表，適用於多數XML格式，並渲染為可視化表格。

---

### 實作畫面

#### **index.html主畫面**



- XML Viewer，提供XML文件上傳、顯示和檢測功能。\
  能夠能夠自動將大部分XML檔轉換成轉換成易於瀏覽的html表格
  ![image](https://hackmd.io/_uploads/BJhoR0rr1g.png)

- 連結書籍管理系統，並能關閉系統。
- 使用內嵌的iframe 顯示 XML 資料，包括原始資料和格式化後html表格。
  ![image](https://hackmd.io/_uploads/H1upACBHyg.png)
  
- 能夠上傳XSD檔案並檢測當前XML檔案，瀏覽器會顯示是否通過XSD驗證
![image](https://hackmd.io/_uploads/SJB2JkUr1g.png)


#### **editbook.html書籍管理頁面**

- 可以手動輸入書籍資料，例如書本編號、書名、類別、作者、價格。
- 也可以直接匯入現有的XML檔案
- 結果以HTML表格格式顯示。
![image](https://hackmd.io/_uploads/B1Aox1LHke.png)

#### **查詢與檢測畫面**

- 能夠自由新增/修改書籍，在修改書籍時會提示使用者避免意外修改
![image](https://hackmd.io/_uploads/HkyyZ1IrJl.png)

- 使用搜尋功能以顯示與用戶想要的書籍資料。
    - 可以以任意欄位進行搜尋
![image](https://hackmd.io/_uploads/rkyDW18B1l.png)

- 查詢結果自動滾動至顯示區域，提升用戶體驗。
![image](https://hackmd.io/_uploads/SyJ_-JIBJg.png)

- 可以匯出查詢結果並下載(預設為report.html)
    - 可於瀏覽器查看下載的查詢結果
![image](https://hackmd.io/_uploads/S110M1UBJe.png)



---

### 討論

#### **系統優勢**

1. 以XML作為資料庫，完全不依賴外部DBMS，免去搭設費用。
2. 支援簡單的匯入/匯出，適合用於輸入或儲存書籍資料。
3. 使用JavaScript進行DOM操作，實作完全在前端對資料進行處理。
4. 增加Node.js後端實現XML與XSD驗證，確保數據結構有效性。
5. XSL樣式表自動生成適用於多數XML結構，增強系統通用性。

#### **系統限制**

1. 對大規模數據來說，XML不如專業DBMS操作有效。
2. 複雜的數據篩選和跨表查詢仍需要更多優化。

#### **改進方向**

1. 提高查詢效能，例如支持更多條件篩選。
2. 增強對XML與XSD驗證錯誤的友好提示。
3. 提供更多格式的數據匯出（例如CSV、JSON）。


### Requirement

#### **Node.js 安裝與啟動伺服器**

1. 確保已安裝 Node.js。

   - 可從 [Node.js 官網](https://nodejs.org) 下載並安裝。

2. 安裝必要套件：

   - 進入專案目錄，運行以下命令安裝所需的 Node.js 套件：
     ```bash
     npm install express libxmljs2 cors body-parser
     ```

3. 啟動伺服器：

   - 在專案目錄下運行以下命令：
     ```bash
     node server.js
     ```

4. 開啟瀏覽器訪問：

   - 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 來查看系統主畫面。


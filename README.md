### konva 編輯器

![首頁](https://github.com/FelixMitsui/konva-editor/blob/main/public/images/konva動畫.gif?raw=true)

部屬網址: https://konva-editor.vercel.app/

## 介紹

這個專案專注在應用Konavjs為主，這是一個HTML5 canvas套件，提供了許多幫助使用者快速開發畫布相關的函式，
Konva的對象顯示於Stage(舞台)上，對象主要以Layer(圖層)嵌套Group(群組)或是形狀(Shape)，以及改變形狀的
變換器(transformer)，還有動畫等多種功能。

## 主要應用

1. Vue3
2. Pinia
3. Element-Plus
4. Konavjs(canvas)


## 開發項目

1. 拖曳形狀、移動以及刪除。
2. 形狀顏色填充、邊框粗度修改與顏色變更。
3. 縮放形狀、旋轉。
4. 新增圖層至側欄以及圖層切換到主畫布。

## 技術探討

1. 如何使用konva?
   將konva邏輯封裝在class，並由pinia呼叫與管理konva實例，方便在組件上直接使用。
2. 拖曳形狀是怎麼實現的?
   標籤屬性draggable為true，表示為可拖曳，並依照拖曳標籤的type(形狀的類型)，
   於畫布上創建相對應的形狀。
3. 側欄圖層切換至主畫布是怎麼實現?
   新增圖層時，創建空的圖層實例存放至圖層的陣列，在切換圖層時，將當前的圖層內容存放回原索引，
   並將切換到的圖層取出，便可以操作取出的對象，並且在顯示側欄圖層時，以圖片的形式顯示。
# Vue 3 Watch 進階學習

## 📋 專案概述
完整的 Vue 3 Composition API watch 學習範例，將每個概念拆分成獨立的組件，便於理解和維護。

## 🎯 組件架構設計

### 主頁面
- **HomeView.vue** - 主要展示頁面，整合所有 watch 範例組件

### 範例組件清單

#### 1. BasicWatchRef.vue
**功能**：基本 watch 監聽 ref
- 監聽單一 ref 值變化
- 展示 newValue 和 oldValue
- 簡單的計數器範例

#### 2. WatchMultipleSources.vue  
**功能**：監聽多個來源
- 陣列形式監聽多個 ref
- 分別監聽多個來源的對比
- 姓名組合範例

#### 3. WatchPropsComputed.vue
**功能**：監聽 props 和 computed
- 父子組件 props 傳遞監聽
- computed 屬性監聽
- toRefs 的使用示範

#### 4. WatchEffectDemo.vue
**功能**：watchEffect 自動偵測
- 自動依賴追蹤展示
- 與 watch 的行為對比
- 多個響應式數據的自動監聽

#### 5. WatchOptions.vue
**功能**：watch 選項參數
- `deep: true/false` 深度監聽對比
- `immediate: true/false` 立即執行展示
- `flush: 'pre'/'post'` 執行時機差異
- 複雜物件監聽範例

#### 6. WatchPerformance.vue
**功能**：效能優化與陷阱
- Race Condition 問題展示與解決
- 防抖動 (debounce) 優化
- AbortController 取消請求
- 搜尋 API 模擬範例

## 🔧 技術實作重點

### 1. 程式碼品質
- 錯誤處理機制
- 記憶體洩漏防護
- 效能最佳化考量

### 2. 學習體驗
- 循序漸進的複雜度
- 實際應用場景模擬
- 常見陷阱的預防展示

### 3. 範例完整性
- 涵蓋所有重要的 watch API
- 實用的使用場景
- 問題解決方案展示
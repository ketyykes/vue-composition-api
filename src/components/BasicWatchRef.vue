<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, watch } from 'vue'

// ==================== 學習重點 ====================
// 1. watch 是用來監聽響應式數據變化的函數
// 2. 第一個參數：要監聽的響應式數據
// 3. 第二個參數：回調函數 (newValue, oldValue) => {}
// 4. 當監聽的數據變化時，回調函數會被執行

// 建立響應式數據 - 使用 ref 包裝基本類型
const count = ref(0)
const message = ref('Hello')

// ==================== 基本 watch 語法 ====================
// 監聽 count 的變化
watch(count, (newValue, oldValue) => {
  // 當 count 改變時，這個函數會被呼叫
  console.log(`🔍 count 監聽器觸發：`)
  console.log(`   舊值：${oldValue}`)
  console.log(`   新值：${newValue}`)
  console.log(`   變化幅度：${newValue - oldValue}`)
  console.log('-------------------')
})

// 監聽 message 的變化
watch(message, (newValue, oldValue) => {
  console.log(`💬 message 監聽器觸發：`)
  console.log(`   舊訊息："${oldValue}"`)
  console.log(`   新訊息："${newValue}"`)
  console.log(`   字數變化：${oldValue?.length || 0} → ${newValue?.length || 0}`)
  console.log('-------------------')
})

// ==================== 操作函數 ====================
// 增加計數器
function increment() {
  count.value++
  // 💡 學習提示：修改 .value 會觸發 watch
}

// 減少計數器
function decrement() {
  count.value--
}

// 重置計數器
function reset() {
  count.value = 0
  // 💡 學習提示：即使設定相同值，watch 也不會觸發
}

// 大幅增加（觀察變化幅度）
function addTen() {
  count.value += 10
}

// 修改訊息
function updateMessage() {
  const messages = [
    'Hello World!',
    'Vue 3 很棒！',
    'Composition API 讚！',
    '學習 watch 中...',
    'JavaScript 好有趣'
  ]
  // 隨機選擇一個不同的訊息
  const currentIndex = messages.indexOf(message.value)
  const availableMessages = messages.filter((_, index) => index !== currentIndex)
  const randomIndex = Math.floor(Math.random() * availableMessages.length)
  message.value = availableMessages[randomIndex]
}

// 清空訊息
function clearMessage() {
  message.value = ''
}
</script>

<template>
  <div class="basic-watch-container">
    <!-- 標題區域 -->
    <div class="section-header">
      <h2>🔍 基本 Watch 監聽 Ref</h2>
      <p class="description">
        學習如何使用 <code>watch</code> 監聽 <code>ref</code> 響應式數據的變化
      </p>
    </div>

    <!-- 計數器範例 -->
    <div class="example-section">
      <h3>📊 計數器監聽範例</h3>
      
      <!-- 顯示當前值 -->
      <div class="value-display">
        <span class="value-label">當前數值：</span>
        <span class="value-number">{{ count }}</span>
      </div>

      <!-- 操作按鈕組 -->
      <div class="button-group">
        <button @click="decrement" class="btn btn-danger">-1</button>
        <button @click="increment" class="btn btn-primary">+1</button>
        <button @click="addTen" class="btn btn-success">+10</button>
        <button @click="reset" class="btn btn-secondary">重置</button>
      </div>

      <!-- 學習提示 -->
      <div class="learning-tip">
        💡 <strong>觀察重點：</strong>點擊按鈕改變 count 值時，留意 Console 的輸出訊息
      </div>
    </div>

    <!-- 文字訊息範例 -->
    <div class="example-section">
      <h3>💬 文字監聽範例</h3>
      
      <!-- 顯示當前訊息 -->
      <div class="message-display">
        <span class="message-label">當前訊息：</span>
        <span class="message-text">{{ message || '(空白)' }}</span>
        <span class="message-length">({{ message.length }} 字)</span>
      </div>

      <!-- 操作按鈕組 -->
      <div class="button-group">
        <button @click="updateMessage" class="btn btn-info">更換訊息</button>
        <button @click="clearMessage" class="btn btn-warning">清空訊息</button>
      </div>

      <!-- 學習提示 -->
      <div class="learning-tip">
        💡 <strong>觀察重點：</strong>修改訊息時，watch 會顯示舊值和新值的差異
      </div>
    </div>

    <!-- 重要概念說明 -->
    <div class="concept-section">
      <h3>🎯 重要概念</h3>
      <ul class="concept-list">
        <li>
          <strong>watch 語法：</strong>
          <code>watch(source, callback)</code>
        </li>
        <li>
          <strong>回調參數：</strong>
          <code>(newValue, oldValue) => {}</code>
        </li>
        <li>
          <strong>觸發條件：</strong>
          只有當 ref.value 真正改變時才會觸發
        </li>
        <li>
          <strong>最佳實踐：</strong>
          在 Console 中查看詳細的變化記錄
        </li>
      </ul>
    </div>

    <!-- Console 提示 -->
    <div class="console-hint">
      🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 查看 watch 監聽器的詳細輸出！
    </div>
  </div>
</template>

<style scoped>
.basic-watch-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.section-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.description {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.description code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  background: #f8f9fa;
}

.example-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 20px;
}

.value-display, .message-display {
  margin: 15px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  border-left: 4px solid #007bff;
}

.value-label, .message-label {
  font-weight: bold;
  color: #495057;
}

.value-number {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-left: 10px;
}

.message-text {
  color: #28a745;
  font-weight: 500;
  margin-left: 10px;
}

.message-length {
  color: #6c757d;
  font-size: 14px;
  margin-left: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  font-size: 14px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.learning-tip {
  margin-top: 15px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  color: #856404;
  font-size: 14px;
}

.concept-section {
  padding: 20px;
  background: #e8f4fd;
  border-radius: 10px;
  margin-bottom: 20px;
}

.concept-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.concept-list {
  margin: 0;
  padding-left: 20px;
}

.concept-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.concept-list code {
  background: #f1f3f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #d63384;
}

.console-hint {
  text-align: center;
  padding: 15px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
  font-weight: bold;
}
</style>
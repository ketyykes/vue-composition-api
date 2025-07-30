<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, computed, watch, watchEffect } from 'vue'

// ==================== 學習重點 ====================
// 1. watchEffect 會自動追蹤函數內使用的響應式數據
// 2. 不需要明確指定監聽目標，自動偵測依賴
// 3. 會立即執行一次，然後在依賴變化時重新執行
// 4. 相比 watch，代碼更簡潔但控制性較少

// 建立響應式數據
const count = ref(0)
const multiplier = ref(2)
const message = ref('Hello')
const isVisible = ref(true)

// 用於存儲 watchEffect 的執行記錄
const watchEffectLogs = ref([])
const watchLogs = ref([])

// ==================== 基本 watchEffect 示範 ====================
// watchEffect 會自動偵測內部使用的響應式數據
watchEffect(() => {
  const result = count.value * multiplier.value
  const timestamp = new Date().toLocaleTimeString()
  
  console.log(`⚡ watchEffect 觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   計算：${count.value} × ${multiplier.value} = ${result}`)
  console.log(`   依賴：count 和 multiplier`)
  console.log('-------------------')
  
  // 同時記錄到響應式陣列中供 UI 顯示
  watchEffectLogs.value.unshift({
    timestamp,
    content: `${count.value} × ${multiplier.value} = ${result}`,
    dependencies: ['count', 'multiplier']
  })
  
  // 限制記錄數量，避免記憶體洩漏
  if (watchEffectLogs.value.length > 10) {
    watchEffectLogs.value.pop()
  }
})

// ==================== 條件式依賴的 watchEffect ====================
// 根據條件動態依賴不同的響應式數據
watchEffect(() => {
  const timestamp = new Date().toLocaleTimeString()
  
  if (isVisible.value) {
    // 當 isVisible 為 true 時，會依賴 message
    console.log(`👁️ 條件式 watchEffect - 顯示模式：`)
    console.log(`   時間：${timestamp}`)
    console.log(`   訊息："${message.value}"`)
    console.log(`   依賴：isVisible, message`)
  } else {
    // 當 isVisible 為 false 時，只依賴 isVisible
    console.log(`🚫 條件式 watchEffect - 隱藏模式：`)
    console.log(`   時間：${timestamp}`)
    console.log(`   依賴：僅 isVisible`)
  }
  console.log('-------------------')
})

// ==================== 對比：使用傳統 watch ====================
// 用傳統 watch 實現相同功能需要明確指定依賴
watch([count, multiplier], ([newCount, newMultiplier], [oldCount, oldMultiplier]) => {
  const result = newCount * newMultiplier
  const timestamp = new Date().toLocaleTimeString()
  
  console.log(`🔍 傳統 watch 觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   計算：${newCount} × ${newMultiplier} = ${result}`)
  console.log(`   舊值：${oldCount} × ${oldMultiplier} = ${oldCount * oldMultiplier}`)
  console.log('-------------------')
  
  watchLogs.value.unshift({
    timestamp,
    content: `${newCount} × ${newMultiplier} = ${result}`,
    oldContent: `${oldCount} × ${oldMultiplier} = ${oldCount * oldMultiplier}`
  })
  
  if (watchLogs.value.length > 10) {
    watchLogs.value.pop()
  }
})

// ==================== 複雜依賴的 watchEffect ====================
const user = ref({ name: '小明', age: 25 })
const preferences = ref({ theme: 'light', language: 'zh' })

watchEffect(() => {
  // 這個 watchEffect 會自動依賴 user.name, user.age, preferences.theme
  const greeting = preferences.value.language === 'zh' 
    ? `你好，${user.value.name}！你今年 ${user.value.age} 歲`
    : `Hello, ${user.value.name}! You are ${user.value.age} years old`
  
  console.log(`🌍 複雜依賴 watchEffect：`)
  console.log(`   問候語："${greeting}"`)
  console.log(`   主題：${preferences.value.theme}`)
  console.log(`   依賴：user.name, user.age, preferences.language, preferences.theme`)
  console.log('===================')
})

// ==================== 計算屬性 vs watchEffect ====================
// 計算屬性 - 用於返回值
const computedResult = computed(() => {
  return `計算結果：${count.value} × ${multiplier.value} = ${count.value * multiplier.value}`
})

// watchEffect - 用於副作用（如 console.log, API 調用等）
watchEffect(() => {
  // 假設我們要根據計算結果執行某些副作用
  const result = count.value * multiplier.value
  
  // 模擬 API 調用或其他副作用
  if (result > 20) {
    console.log(`📊 副作用觸發：結果 ${result} 超過閾值 20`)
  }
})

// ==================== 操作函數 ====================
function incrementCount() {
  count.value++
}

function decrementCount() {
  count.value--
}

function resetCount() {
  count.value = 0
}

function increaseMultiplier() {
  multiplier.value++
}

function decreaseMultiplier() {
  if (multiplier.value > 1) {
    multiplier.value--
  }
}

function updateMessage() {
  const messages = ['Hello', 'World', 'Vue', 'Composition', 'API', 'watchEffect']
  const current = messages.indexOf(message.value)
  const available = messages.filter((_, index) => index !== current)
  const randomIndex = Math.floor(Math.random() * available.length)
  message.value = available[randomIndex]
}

function toggleVisibility() {
  isVisible.value = !isVisible.value
}

function updateUser() {
  const names = ['小明', '小華', '小美', '小強', '小芳']
  const ages = [20, 25, 30, 35, 40]
  
  user.value = {
    name: names[Math.floor(Math.random() * names.length)],
    age: ages[Math.floor(Math.random() * ages.length)]
  }
}

function toggleTheme() {
  preferences.value.theme = preferences.value.theme === 'light' ? 'dark' : 'light'
}

function toggleLanguage() {
  preferences.value.language = preferences.value.language === 'zh' ? 'en' : 'zh'
}

function clearLogs() {
  watchEffectLogs.value = []
  watchLogs.value = []
}
</script>

<template>
  <div class="watch-effect-container">
    <!-- 標題區域 -->
    <div class="section-header">
      <h2>⚡ watchEffect 自動偵測</h2>
      <p class="description">
        學習 <code>watchEffect</code> 如何<strong>自動偵測依賴</strong>，
        以及與傳統 <code>watch</code> 的差異和使用場景
      </p>
    </div>

    <!-- 當前數據狀態 -->
    <div class="current-state-section">
      <h3>📊 當前響應式數據</h3>
      <div class="state-grid">
        <div class="state-item">
          <span class="state-label">計數器：</span>
          <span class="state-value">{{ count }}</span>
        </div>
        <div class="state-item">
          <span class="state-label">乘數：</span>
          <span class="state-value">{{ multiplier }}</span>
        </div>
        <div class="state-item">
          <span class="state-label">結果：</span>
          <span class="state-value result">{{ count * multiplier }}</span>
        </div>
        <div class="state-item">
          <span class="state-label">訊息：</span>
          <span class="state-value">{{ message }}</span>
        </div>
        <div class="state-item">
          <span class="state-label">可見性：</span>
          <span class="state-value">{{ isVisible ? '顯示' : '隱藏' }}</span>
        </div>
      </div>
    </div>

    <!-- 基本操作區 -->
    <div class="example-section">
      <h3>🎮 基本數據操作</h3>
      <div class="control-group">
        <div class="control-section">
          <h4>計數器控制</h4>
          <div class="button-group">
            <button @click="decrementCount" class="btn btn-danger">-1</button>
            <button @click="incrementCount" class="btn btn-success">+1</button>
            <button @click="resetCount" class="btn btn-secondary">重置</button>
          </div>
        </div>
        
        <div class="control-section">
          <h4>乘數控制</h4>
          <div class="button-group">
            <button @click="decreaseMultiplier" class="btn btn-warning">-1</button>
            <button @click="increaseMultiplier" class="btn btn-primary">+1</button>
          </div>
        </div>
        
        <div class="control-section">
          <h4>其他控制</h4>
          <div class="button-group">
            <button @click="updateMessage" class="btn btn-info">換訊息</button>
            <button @click="toggleVisibility" class="btn btn-secondary">
              {{ isVisible ? '隱藏' : '顯示' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 複雜數據操作 -->
    <div class="example-section">
      <h3>👤 複雜依賴操作</h3>
      <div class="user-section">
        <div class="user-info">
          <div class="info-item">
            <span class="info-label">用戶：</span>
            <span class="info-value">{{ user.name }} ({{ user.age }}歲)</span>
          </div>
          <div class="info-item">
            <span class="info-label">主題：</span>
            <span class="info-value">{{ preferences.theme }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">語言：</span>
            <span class="info-value">{{ preferences.language }}</span>
          </div>
        </div>
        <div class="button-group">
          <button @click="updateUser" class="btn btn-primary">更換用戶</button>
          <button @click="toggleTheme" class="btn btn-info">切換主題</button>
          <button @click="toggleLanguage" class="btn btn-success">切換語言</button>
        </div>
      </div>
    </div>

    <!-- 執行記錄展示 -->
    <div class="logs-section">
      <div class="logs-header">
        <h3>📝 執行記錄</h3>
        <button @click="clearLogs" class="btn btn-sm btn-secondary">清空記錄</button>
      </div>
      
      <div class="logs-grid">
        <!-- watchEffect 記錄 -->
        <div class="log-panel">
          <h4>⚡ watchEffect 記錄</h4>
          <div class="log-list">
            <div 
              v-for="(log, index) in watchEffectLogs" 
              :key="`effect-${index}`"
              class="log-item effect-log"
            >
              <div class="log-time">{{ log.timestamp }}</div>
              <div class="log-content">{{ log.content }}</div>
              <div class="log-deps">依賴: {{ log.dependencies.join(', ') }}</div>
            </div>
            <div v-if="watchEffectLogs.length === 0" class="no-logs">
              尚無執行記錄
            </div>
          </div>
        </div>
        
        <!-- watch 記錄 -->
        <div class="log-panel">
          <h4>🔍 傳統 watch 記錄</h4>
          <div class="log-list">
            <div 
              v-for="(log, index) in watchLogs" 
              :key="`watch-${index}`"
              class="log-item watch-log"
            >
              <div class="log-time">{{ log.timestamp }}</div>
              <div class="log-content">新值: {{ log.content }}</div>
              <div class="log-old">舊值: {{ log.oldContent }}</div>
            </div>
            <div v-if="watchLogs.length === 0" class="no-logs">
              尚無執行記錄
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 對比說明 -->
    <div class="comparison-section">
      <h3>🔍 watchEffect vs watch 對比</h3>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h4>⚡ watchEffect</h4>
          <div class="pros-cons">
            <div class="pros">
              <h5>✅ 優點</h5>
              <ul>
                <li>自動偵測依賴，不需手動指定</li>
                <li>代碼更簡潔直觀</li>
                <li>立即執行一次</li>
                <li>適合執行副作用操作</li>
              </ul>
            </div>
            <div class="cons">
              <h5>⚠️ 缺點</h5>
              <ul>
                <li>無法獲取舊值</li>
                <li>依賴追蹤可能不夠精確</li>
                <li>調試相對困難</li>
                <li>控制性較低</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="comparison-item">
          <h4>🔍 watch</h4>
          <div class="pros-cons">
            <div class="pros">
              <h5>✅ 優點</h5>
              <ul>
                <li>明確指定監聽目標</li>
                <li>可以獲取新值和舊值</li>
                <li>有更多選項控制 (deep, immediate)</li>
                <li>調試更容易</li>
              </ul>
            </div>
            <div class="cons">
              <h5>⚠️ 缺點</h5>
              <ul>
                <li>需要手動指定依賴</li>
                <li>代碼相對複雜</li>
                <li>不會立即執行</li>
                <li>多依賴時語法較繁瑣</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用場景建議 -->
    <div class="usage-guide">
      <h3>💡 使用場景建議</h3>
      <div class="usage-grid">
        <div class="usage-item">
          <h4>🎯 使用 watchEffect 當</h4>
          <ul>
            <li>執行副作用操作（API 調用、日誌記錄）</li>
            <li>依賴關係複雜且經常變化</li>
            <li>不需要舊值比較</li>
            <li>希望立即執行一次</li>
          </ul>
        </div>
        <div class="usage-item">
          <h4>🎯 使用 watch 當</h4>
          <ul>
            <li>需要比較新舊值</li>
            <li>需要精確控制監聽目標</li>
            <li>需要配置選項（deep, immediate）</li>
            <li>調試和維護是重點考量</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Console 提示 -->
    <div class="console-hint">
      🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 查看 watchEffect 的自動依賴偵測記錄！
    </div>
  </div>
</template>

<style scoped>
.watch-effect-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #2c3e50;
  border-radius: 12px;
}

.current-state-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.state-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.state-label {
  display: block;
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.state-value {
  font-weight: bold;
  font-size: 18px;
}

.state-value.result {
  color: #ffd700;
  font-size: 20px;
}

.example-section {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.control-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.control-section h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 16px;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  background: white;
  padding: 10px 15px;
  border-radius: 6px;
  border-left: 4px solid #28a745;
}

.info-label {
  font-weight: bold;
  color: #495057;
}

.info-value {
  color: #28a745;
  margin-left: 5px;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-primary { background: #007bff; color: white; }
.btn-success { background: #28a745; color: white; }
.btn-danger { background: #dc3545; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-info { background: #17a2b8; color: white; }
.btn-secondary { background: #6c757d; color: white; }

.logs-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid #dee2e6;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logs-header h3 {
  margin: 0;
  color: #2c3e50;
}

.logs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.log-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.log-panel h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 16px;
}

.log-list {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  background: white;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 4px solid #007bff;
}

.effect-log {
  border-left-color: #ffc107;
}

.watch-log {
  border-left-color: #28a745;
}

.log-time {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

.log-content, .log-old {
  font-size: 14px;
  margin-bottom: 2px;
}

.log-deps {
  font-size: 12px;
  color: #007bff;
  font-style: italic;
}

.no-logs {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

.comparison-section, .usage-guide {
  margin-bottom: 30px;
  padding: 20px;
  background: #e8f4fd;
  border-radius: 12px;
}

.comparison-grid, .usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.comparison-item, .usage-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.comparison-item h4, .usage-item h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.pros h5 {
  color: #28a745;
  margin: 0 0 8px 0;
}

.cons h5 {
  color: #ffc107;
  margin: 0 0 8px 0;
}

.pros ul, .cons ul, .usage-item ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
}

.pros li, .cons li, .usage-item li {
  margin-bottom: 4px;
  line-height: 1.4;
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

@media (max-width: 768px) {
  .control-group, .logs-grid, .comparison-grid, .usage-grid {
    grid-template-columns: 1fr;
  }
  
  .pros-cons {
    grid-template-columns: 1fr;
  }
  
  .user-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
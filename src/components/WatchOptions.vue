<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, reactive, watch, nextTick } from 'vue'

// ==================== 學習重點 ====================
// 1. deep: true/false - 控制是否深度監聽物件內部變化
// 2. immediate: true/false - 控制是否立即執行監聽器
// 3. flush: 'pre'/'post'/'sync' - 控制監聽器的執行時機
// 4. 不同選項組合會產生不同的行為

// 建立響應式數據
const shallowData = ref({ count: 0, message: 'Hello' })
const deepData = reactive({
  user: {
    name: '小明',
    profile: {
      age: 25,
      hobbies: ['讀書', '游泳']
    }
  },
  settings: {
    theme: 'light',
    notifications: true
  }
})

const simpleCounter = ref(0)
const executionLogs = ref([])
const domElement = ref(null)

// ==================== Deep 選項示範 ====================
// 淺層監聽 (預設 deep: false)
watch(shallowData, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`🌊 淺層監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：`, newVal)
  console.log(`   舊值：`, oldVal)
  console.log(`   觸發原因：整個物件被重新賦值`)
  console.log('-------------------')
  
  addLog('淺層監聽', `物件重新賦值`, timestamp)
}, { 
  deep: false // 明確指定淺層監聽（預設值）
})

// 深度監聽 (deep: true)
watch(deepData, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`🏊‍♂️ 深度監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：`, newVal)
  console.log(`   舊值：`, oldVal)
  console.log(`   觸發原因：物件內部屬性變化`)
  console.log('-------------------')
  
  addLog('深度監聽', `物件內部屬性變化`, timestamp)
}, { 
  deep: true // 深度監聽物件內部變化
})

// ==================== Immediate 選項示範 ====================
// immediate: false (預設)
watch(simpleCounter, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`⏰ 非立即監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：${newVal}`)
  console.log(`   舊值：${oldVal}`)
  console.log(`   說明：只在數據改變時觸發，不會立即執行`)
  console.log('-------------------')
  
  addLog('非立即監聽', `${oldVal} → ${newVal}`, timestamp)
}, { 
  immediate: false // 預設值，不立即執行
})

// immediate: true
watch(simpleCounter, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`🚀 立即監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：${newVal}`)
  console.log(`   舊值：${oldVal}`)
  console.log(`   說明：組件創建時立即執行一次，然後在數據改變時觸發`)
  console.log('-------------------')
  
  addLog('立即監聽', oldVal === undefined ? '初始執行' : `${oldVal} → ${newVal}`, timestamp)
}, { 
  immediate: true // 立即執行一次
})

// ==================== Flush 選項示範 ====================
// flush: 'pre' (預設) - 在組件更新前執行
watch(simpleCounter, async (newVal) => {
  const timestamp = new Date().toLocaleTimeString()
  
  // 檢查 DOM 是否已更新
  const domContent = domElement.value?.textContent || 'DOM 未找到'
  
  console.log(`🔄 Pre-flush 監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：${newVal}`)
  console.log(`   DOM 內容：${domContent}`)
  console.log(`   說明：在 DOM 更新前執行，DOM 可能還是舊值`)
  console.log('-------------------')
  
  addLog('Pre-flush', `新值 ${newVal}, DOM: ${domContent}`, timestamp)
}, { 
  flush: 'pre' // 預設值，在組件更新前執行
})

// flush: 'post' - 在組件更新後執行
watch(simpleCounter, async (newVal) => {
  const timestamp = new Date().toLocaleTimeString()
  
  // 等待下一個 tick 確保 DOM 已更新
  await nextTick()
  const domContent = domElement.value?.textContent || 'DOM 未找到'
  
  console.log(`✅ Post-flush 監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：${newVal}`)
  console.log(`   DOM 內容：${domContent}`)
  console.log(`   說明：在 DOM 更新後執行，可以獲取最新的 DOM`)
  console.log('-------------------')
  
  addLog('Post-flush', `新值 ${newVal}, DOM: ${domContent}`, timestamp)
}, { 
  flush: 'post' // 在組件更新後執行
})

// flush: 'sync' - 同步執行 (謹慎使用)
watch(simpleCounter, (newVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`⚡ Sync-flush 監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   新值：${newVal}`)
  console.log(`   說明：同步執行，可能影響效能`)
  console.log('-------------------')
  
  addLog('Sync-flush', `新值 ${newVal}`, timestamp)
}, { 
  flush: 'sync' // 同步執行，謹慎使用
})

// ==================== 複合選項示範 ====================
// 同時使用 deep + immediate
watch(deepData, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`🎯 深度+立即監聽觸發：`)
  console.log(`   時間：${timestamp}`)
  console.log(`   用戶名稱：${newVal.user.name}`)
  console.log(`   年齡：${newVal.user.profile.age}`)
  console.log(`   主題：${newVal.settings.theme}`)
  console.log(`   說明：深度監聽 + 立即執行`)
  console.log('===================')
  
  addLog('深度+立即', `${newVal.user.name}, ${newVal.user.profile.age}歲`, timestamp)
}, { 
  deep: true,
  immediate: true,
  flush: 'post'
})

// ==================== 工具函數 ====================
function addLog(type, content, timestamp) {
  executionLogs.value.unshift({
    type,
    content,
    timestamp
  })
  
  // 限制記錄數量
  if (executionLogs.value.length > 20) {
    executionLogs.value.pop()
  }
}

// ==================== 操作函數 ====================
// 淺層數據操作
function updateShallowObject() {
  // 這會觸發淺層監聽，因為整個物件被重新賦值
  shallowData.value = { 
    count: shallowData.value.count + 1, 
    message: 'Updated!' 
  }
}

function updateShallowProperty() {
  // 這不會觸發淺層監聽，因為只是修改屬性
  shallowData.value.count++
  shallowData.value.message = 'Property Updated'
}

// 深層數據操作
function updateUserName() {
  const names = ['小明', '小華', '小美', '小強', '小芳']
  const current = names.indexOf(deepData.user.name)
  const available = names.filter((_, index) => index !== current)
  const randomIndex = Math.floor(Math.random() * available.length)
  deepData.user.name = available[randomIndex]
}

function updateUserAge() {
  deepData.user.profile.age = Math.floor(Math.random() * 50) + 18
}

function addHobby() {
  const hobbies = ['電影', '音樂', '旅行', '攝影', '烹飪', '運動', '繪畫']
  const currentHobbies = deepData.user.profile.hobbies
  const available = hobbies.filter(hobby => !currentHobbies.includes(hobby))
  
  if (available.length > 0) {
    const randomHobby = available[Math.floor(Math.random() * available.length)]
    deepData.user.profile.hobbies.push(randomHobby)
  }
}

function removeHobby() {
  if (deepData.user.profile.hobbies.length > 0) {
    deepData.user.profile.hobbies.pop()
  }
}

function toggleTheme() {
  deepData.settings.theme = deepData.settings.theme === 'light' ? 'dark' : 'light'
}

function toggleNotifications() {
  deepData.settings.notifications = !deepData.settings.notifications
}

// 簡單計數器操作
function incrementCounter() {
  simpleCounter.value++
}

function decrementCounter() {
  simpleCounter.value--
}

function resetCounter() {
  simpleCounter.value = 0
}

function clearLogs() {
  executionLogs.value = []
}
</script>

<template>
  <div class="watch-options-container">
    <!-- 標題區域 -->
    <div class="section-header">
      <h2>⚙️ Watch 選項參數</h2>
      <p class="description">
        深入學習 <code>watch</code> 的選項參數：
        <code>deep</code>、<code>immediate</code>、<code>flush</code> 的不同行為
      </p>
    </div>

    <!-- 當前數據狀態 -->
    <div class="current-state-section">
      <h3>📊 當前數據狀態</h3>
      <div class="state-display">
        <div class="data-group">
          <h4>🌊 淺層數據 (shallowData)</h4>
          <div class="data-content">
            <div>count: {{ shallowData.count }}</div>
            <div>message: "{{ shallowData.message }}"</div>
          </div>
        </div>
        
        <div class="data-group">
          <h4>🏊‍♂️ 深層數據 (deepData)</h4>
          <div class="data-content">
            <div>用戶: {{ deepData.user.name }}</div>
            <div>年齡: {{ deepData.user.profile.age }}</div>
            <div>興趣: {{ deepData.user.profile.hobbies.join(', ') }}</div>
            <div>主題: {{ deepData.settings.theme }}</div>
            <div>通知: {{ deepData.settings.notifications ? '開啟' : '關閉' }}</div>
          </div>
        </div>
        
        <div class="data-group">
          <h4>🔢 簡單計數器 (用於 flush 測試)</h4>
          <div class="data-content">
            <div ref="domElement" class="counter-display">{{ simpleCounter }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deep 選項操作 -->
    <div class="example-section">
      <h3>🏊‍♂️ Deep 選項測試</h3>
      <div class="option-explanation">
        <p><strong>deep: false (預設)</strong> - 只監聽物件引用變化</p>
        <p><strong>deep: true</strong> - 監聽物件內部屬性變化</p>
      </div>
      
      <div class="control-groups">
        <div class="control-group">
          <h4>淺層數據操作</h4>
          <div class="button-group">
            <button @click="updateShallowObject" class="btn btn-primary">
              🔄 重新賦值整個物件
            </button>
            <button @click="updateShallowProperty" class="btn btn-warning">
              📝 只修改屬性值
            </button>
          </div>
          <div class="explanation">
            第一個按鈕會觸發淺層監聽，第二個不會
          </div>
        </div>
        
        <div class="control-group">
          <h4>深層數據操作</h4>
          <div class="button-group">
            <button @click="updateUserName" class="btn btn-info">👤 換名字</button>
            <button @click="updateUserAge" class="btn btn-success">🎂 換年齡</button>
            <button @click="addHobby" class="btn btn-secondary">➕ 加興趣</button>
            <button @click="removeHobby" class="btn btn-danger">➖ 減興趣</button>
            <button @click="toggleTheme" class="btn btn-primary">🎨 切換主題</button>
            <button @click="toggleNotifications" class="btn btn-warning">🔔 切換通知</button>
          </div>
          <div class="explanation">
            所有按鈕都會觸發深度監聽
          </div>
        </div>
      </div>
    </div>

    <!-- Immediate 和 Flush 選項操作 -->
    <div class="example-section">
      <h3>⚡ Immediate & Flush 選項測試</h3>
      <div class="option-explanation">
        <p><strong>immediate: true</strong> - 組件創建時立即執行一次</p>
        <p><strong>flush: 'pre'</strong> - DOM 更新前執行 (預設)</p>
        <p><strong>flush: 'post'</strong> - DOM 更新後執行</p>
        <p><strong>flush: 'sync'</strong> - 同步執行</p>
      </div>
      
      <div class="control-group">
        <h4>計數器操作 (觀察執行時機)</h4>
        <div class="button-group">
          <button @click="decrementCounter" class="btn btn-danger">-1</button>
          <button @click="incrementCounter" class="btn btn-success">+1</button>
          <button @click="resetCounter" class="btn btn-secondary">重置</button>
        </div>
        <div class="explanation">
          觀察 Console 中不同 flush 選項的執行時機和 DOM 內容
        </div>
      </div>
    </div>

    <!-- 執行記錄 -->
    <div class="logs-section">
      <div class="logs-header">
        <h3>📝 監聽器執行記錄</h3>
        <button @click="clearLogs" class="btn btn-sm btn-secondary">清空記錄</button>
      </div>
      
      <div class="logs-container">
        <div v-if="executionLogs.length === 0" class="no-logs">
          尚無執行記錄，試著操作上面的按鈕
        </div>
        <transition-group name="log" tag="div" class="log-list">
          <div 
            v-for="(log, index) in executionLogs" 
            :key="`log-${index}-${log.timestamp}`"
            class="log-item"
            :class="`log-${log.type.toLowerCase().replace(/[^a-z]/g, '-')}`"
          >
            <div class="log-header">
              <span class="log-type">{{ log.type }}</span>
              <span class="log-time">{{ log.timestamp }}</span>
            </div>
            <div class="log-content">{{ log.content }}</div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- 選項詳細說明 -->
    <div class="options-reference">
      <h3>📚 選項參數詳細說明</h3>
      <div class="reference-grid">
        <div class="reference-item">
          <h4>🏊‍♂️ deep</h4>
          <div class="option-details">
            <div class="option-value">
              <code>deep: false</code> (預設)
              <p>只監聽物件引用的變化，不監聽內部屬性</p>
            </div>
            <div class="option-value">
              <code>deep: true</code>
              <p>深度監聽物件內部所有屬性的變化</p>
            </div>
          </div>
          <div class="performance-note">
            ⚠️ 深度監聽會影響效能，謹慎使用於大型物件
          </div>
        </div>
        
        <div class="reference-item">
          <h4>🚀 immediate</h4>
          <div class="option-details">
            <div class="option-value">
              <code>immediate: false</code> (預設)
              <p>只在數據變化時觸發回調</p>
            </div>
            <div class="option-value">
              <code>immediate: true</code>
              <p>組件創建時立即執行一次回調</p>
            </div>
          </div>
          <div class="use-case">
            💡 適用於需要初始化邏輯的場景
          </div>
        </div>
        
        <div class="reference-item">
          <h4>⏰ flush</h4>
          <div class="option-details">
            <div class="option-value">
              <code>flush: 'pre'</code> (預設)
              <p>在組件更新前執行，DOM 可能還是舊值</p>
            </div>
            <div class="option-value">
              <code>flush: 'post'</code>
              <p>在組件更新後執行，DOM 已經是新值</p>
            </div>
            <div class="option-value">
              <code>flush: 'sync'</code>
              <p>同步執行，會阻塞響應式更新</p>
            </div>
          </div>
          <div class="performance-note">
            ⚠️ sync 選項可能影響效能，通常不建議使用
          </div>
        </div>
      </div>
    </div>

    <!-- 最佳實踐建議 -->
    <div class="best-practices">
      <h3>💡 最佳實踐建議</h3>
      <div class="practices-grid">
        <div class="practice-item">
          <h4>🎯 選擇合適的 deep 設定</h4>
          <ul>
            <li>小型物件或需要監聽內部變化時使用 <code>deep: true</code></li>
            <li>大型物件或只關心引用變化時使用 <code>deep: false</code></li>
            <li>考慮使用具體屬性監聽而非整體深度監聽</li>
          </ul>
        </div>
        
        <div class="practice-item">
          <h4>⚡ 合理使用 immediate</h4>
          <ul>
            <li>需要初始化邏輯時使用 <code>immediate: true</code></li>
            <li>避免在 immediate 回調中進行重量級操作</li>
            <li>注意 immediate 回調中 oldValue 為 undefined</li>
          </ul>
        </div>
        
        <div class="practice-item">
          <h4>🔄 選擇正確的 flush 時機</h4>
          <ul>
            <li>需要讀取 DOM 時使用 <code>flush: 'post'</code></li>
            <li>一般情況使用預設的 <code>flush: 'pre'</code></li>
            <li>避免使用 <code>flush: 'sync'</code> 除非特殊需求</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Console 提示 -->
    <div class="console-hint">
      🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 查看不同選項的詳細執行記錄！
    </div>
  </div>
</template>

<style scoped>
.watch-options-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%);
  color: #2c3e50;
  border-radius: 12px;
}

.current-state-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.state-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.data-group {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.data-group h4 {
  margin: 0 0 10px 0;
  color: #007bff;
  font-size: 16px;
}

.data-content {
  font-size: 14px;
  line-height: 1.6;
}

.data-content > div {
  margin-bottom: 4px;
  padding: 2px 0;
}

.counter-display {
  font-size: 24px;
  font-weight: bold;
  color: #28a745;
  text-align: center;
  padding: 10px;
  background: #e8f5e8;
  border-radius: 6px;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid #dee2e6;
}

.example-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.option-explanation {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2196f3;
}

.option-explanation p {
  margin: 5px 0;
  font-size: 14px;
}

.control-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.control-group {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.control-group h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  font-size: 13px;
  white-space: nowrap;
}

.btn-sm {
  padding: 6px 10px;
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

.explanation {
  font-size: 13px;
  color: #6c757d;
  font-style: italic;
  margin-top: 8px;
}

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

.logs-container {
  max-height: 400px;
  overflow-y: auto;
}

.no-logs {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 40px 20px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  border-left: 4px solid #007bff;
  transition: all 0.3s ease;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.log-type {
  font-weight: bold;
  color: #495057;
  font-size: 14px;
}

.log-time {
  font-size: 12px;
  color: #6c757d;
}

.log-content {
  font-size: 13px;
  color: #495057;
}

/* 不同類型的日誌顏色 */
.log-淺層監聽 { border-left-color: #17a2b8; }
.log-深度監聽 { border-left-color: #28a745; }
.log-非立即監聽 { border-left-color: #ffc107; }
.log-立即監聽 { border-left-color: #dc3545; }
.log-pre-flush { border-left-color: #6f42c1; }
.log-post-flush { border-left-color: #20c997; }
.log-sync-flush { border-left-color: #fd7e14; }
.log-深度-立即 { border-left-color: #e83e8c; }

/* 日誌動畫 */
.log-enter-active, .log-leave-active {
  transition: all 0.3s ease;
}

.log-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.log-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.options-reference, .best-practices {
  margin-bottom: 30px;
  padding: 20px;
  background: #e8f4fd;
  border-radius: 12px;
}

.reference-grid, .practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.reference-item, .practice-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.reference-item h4, .practice-item h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.option-details {
  margin-bottom: 15px;
}

.option-value {
  margin-bottom: 12px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.option-value code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  color: #495057;
}

.option-value p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #6c757d;
}

.performance-note, .use-case {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
}

.performance-note {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.use-case {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.practice-item ul {
  margin: 0;
  padding-left: 20px;
}

.practice-item li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.4;
}

.practice-item code {
  background: #f1f3f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
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
  .state-display,
  .control-groups,
  .reference-grid,
  .practices-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .logs-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>
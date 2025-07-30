<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, watch } from 'vue'

// ==================== 學習重點 ====================
// 1. watch 可以同時監聽多個響應式數據來源
// 2. 使用陣列語法：watch([source1, source2], callback)
// 3. 回調函數參數變成陣列：([newVal1, newVal2], [oldVal1, oldVal2])
// 4. 任何一個來源改變都會觸發監聽器

// 建立多個響應式數據
const firstName = ref('王')
const lastName = ref('小明')
const age = ref(25)
const city = ref('台北')

// ==================== 監聽多個來源的方法 ====================

// 方法一：陣列形式同時監聽多個來源
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`👥 姓名監聽器 (陣列形式)：`)
  console.log(`   舊姓名：${oldFirst}${oldLast}`)
  console.log(`   新姓名：${newFirst}${newLast}`)
  console.log(`   變更詳情：`)
  console.log(`     姓氏："${oldFirst}" → "${newFirst}"`)
  console.log(`     名字："${oldLast}" → "${newLast}"`)
  console.log('-------------------')
})

// 方法二：監聽年齡和城市
watch([age, city], ([newAge, newCity], [oldAge, oldCity]) => {
  console.log(`📍 個人資料監聽器：`)
  console.log(`   年齡變化：${oldAge} → ${newAge} 歲`)
  console.log(`   城市變化：${oldCity} → ${newCity}`)
  console.log(`   ${newAge >= oldAge ? '🎂 年齡增長' : '⏪ 年齡調整'}`)
  console.log(`   ${newCity !== oldCity ? '🏠 搬家了' : '🏡 還在同一城市'}`)
  console.log('-------------------')
})

// 方法三：監聽所有資料（展示複雜監聽）
watch([firstName, lastName, age, city], 
  ([newFirst, newLast, newAge, newCity], [oldFirst, oldLast, oldAge, oldCity]) => {
    console.log(`🔍 完整資料監聽器：`)
    console.log(`   完整舊資料：${oldFirst}${oldLast}, ${oldAge}歲, 住${oldCity}`)
    console.log(`   完整新資料：${newFirst}${newLast}, ${newAge}歲, 住${newCity}`)
    
    // 分析變更內容
    const changes = []
    if (newFirst !== oldFirst) changes.push(`姓氏: ${oldFirst} → ${newFirst}`)
    if (newLast !== oldLast) changes.push(`名字: ${oldLast} → ${newLast}`)
    if (newAge !== oldAge) changes.push(`年齡: ${oldAge} → ${newAge}`)
    if (newCity !== oldCity) changes.push(`城市: ${oldCity} → ${newCity}`)
    
    console.log(`   本次變更：${changes.join(', ')}`)
    console.log('===================')
  }
)

// ==================== 對比：分別監聽的方式 ====================
// 這種方式會為每個數據創建獨立的監聽器

watch(firstName, (newVal, oldVal) => {
  console.log(`🔸 獨立監聽 - 姓氏：${oldVal} → ${newVal}`)
})

watch(lastName, (newVal, oldVal) => {
  console.log(`🔸 獨立監聽 - 名字：${oldVal} → ${newVal}`)
})

// ==================== 操作函數 ====================

// 修改姓氏
function changeFirstName() {
  const surnames = ['王', '李', '張', '陳', '林', '黃', '劉', '吳']
  const current = surnames.indexOf(firstName.value)
  const available = surnames.filter((_, index) => index !== current)
  const randomIndex = Math.floor(Math.random() * available.length)
  firstName.value = available[randomIndex]
}

// 修改名字
function changeLastName() {
  const names = ['小明', '小華', '小美', '小強', '小芳', '小偉', '小雯', '小傑']
  const current = names.indexOf(lastName.value)
  const available = names.filter((_, index) => index !== current)
  const randomIndex = Math.floor(Math.random() * available.length)
  lastName.value = available[randomIndex]
}

// 同時修改姓名（觀察陣列監聽行為）
function changeFullName() {
  changeFirstName()
  // 使用 setTimeout 來展示監聽器的觸發時機
  setTimeout(() => {
    changeLastName()
  }, 100) // 短暫延遲讓學習者觀察分次觸發
}

// 增加年齡
function increaseAge() {
  age.value++
}

// 減少年齡
function decreaseAge() {
  if (age.value > 0) {
    age.value--
  }
}

// 隨機設定年齡
function randomAge() {
  age.value = Math.floor(Math.random() * 60) + 18 // 18-77歲
}

// 更換城市
function changeCity() {
  const cities = ['台北', '台中', '台南', '高雄', '桃園', '新竹', '基隆', '花蓮']
  const current = cities.indexOf(city.value)
  const available = cities.filter((_, index) => index !== current)
  const randomIndex = Math.floor(Math.random() * available.length)
  city.value = available[randomIndex]
}

// 重置所有資料
function resetAll() {
  firstName.value = '王'
  lastName.value = '小明'
  age.value = 25
  city.value = '台北'
}

// 批次更新（觀察單次觸發）
function batchUpdate() {
  // Vue 3 的響應式系統會將同步更新批次處理
  firstName.value = '陳'
  lastName.value = '大華'
  age.value = 30
  city.value = '高雄'
  // 💡 學習重點：這四個更新會被批次處理，監聽器只觸發一次
}
</script>

<template>
  <div class="multiple-sources-container">
    <!-- 標題區域 -->
    <div class="section-header">
      <h2>👥 監聽多個來源</h2>
      <p class="description">
        學習如何使用 <code>watch</code> 同時監聽多個響應式數據，
        以及<strong>陣列監聽</strong>與<strong>獨立監聽</strong>的差異
      </p>
    </div>

    <!-- 當前資料展示 -->
    <div class="current-data-section">
      <h3>📊 當前個人資料</h3>
      <div class="data-display">
        <div class="data-item">
          <span class="data-label">姓名：</span>
          <span class="data-value name-value">{{ firstName }}{{ lastName }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">年齡：</span>
          <span class="data-value age-value">{{ age }} 歲</span>
        </div>
        <div class="data-item">
          <span class="data-label">城市：</span>
          <span class="data-value city-value">{{ city }}</span>
        </div>
      </div>
    </div>

    <!-- 姓名操作區 -->
    <div class="example-section">
      <h3>👤 姓名修改操作</h3>
      <div class="button-group">
        <button @click="changeFirstName" class="btn btn-primary">
          🔄 換姓氏 ({{ firstName }})
        </button>
        <button @click="changeLastName" class="btn btn-info">
          🔄 換名字 ({{ lastName }})
        </button>
        <button @click="changeFullName" class="btn btn-success">
          👥 同時換姓名
        </button>
      </div>
      <div class="learning-tip">
        💡 <strong>觀察重點：</strong>
        <ul>
          <li>單獨修改姓氏或名字時，陣列監聽器會觸發</li>
          <li>同時修改會看到監聽器分次觸發（有短暫延遲）</li>
          <li>獨立監聽器只在對應數據改變時觸發</li>
        </ul>
      </div>
    </div>

    <!-- 年齡操作區 -->
    <div class="example-section">
      <h3>🎂 年齡修改操作</h3>
      <div class="button-group">
        <button @click="decreaseAge" class="btn btn-warning">
          ➖ 年齡 -1
        </button>
        <button @click="increaseAge" class="btn btn-primary">
          ➕ 年齡 +1
        </button>
        <button @click="randomAge" class="btn btn-secondary">
          🎲 隨機年齡
        </button>
      </div>
    </div>

    <!-- 城市操作區 -->
    <div class="example-section">
      <h3>🏙️ 城市修改操作</h3>
      <div class="button-group">
        <button @click="changeCity" class="btn btn-info">
          🏠 搬家到其他城市
        </button>
      </div>
    </div>

    <!-- 批次操作區 -->
    <div class="example-section batch-section">
      <h3>⚡ 批次操作</h3>
      <div class="button-group">
        <button @click="batchUpdate" class="btn btn-danger">
          🚀 批次更新全部資料
        </button>
        <button @click="resetAll" class="btn btn-secondary">
          🔄 重置為預設值
        </button>
      </div>
      <div class="learning-tip">
        💡 <strong>批次更新重點：</strong>
        Vue 3 會將同步的多個更新批次處理，監聽器只觸發一次，提升效能
      </div>
    </div>

    <!-- 監聽方式對比 -->
    <div class="concept-section">
      <h3>🔍 監聽方式對比</h3>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h4>陣列監聽</h4>
          <code>watch([a, b], ([newA, newB], [oldA, oldB]) => {})</code>
          <ul>
            <li>✅ 任一數據變化都觸發</li>
            <li>✅ 可比對多個數據的關聯性</li>
            <li>✅ 回調函數參數為陣列格式</li>
            <li>⚠️ 所有數據都會傳入，即使只有一個改變</li>
          </ul>
        </div>
        <div class="comparison-item">
          <h4>獨立監聽</h4>
          <code>watch(a, callback1); watch(b, callback2)</code>
          <ul>
            <li>✅ 只關心特定數據變化</li>
            <li>✅ 回調函數邏輯更單純</li>
            <li>✅ 參數格式簡單 (newVal, oldVal)</li>
            <li>⚠️ 無法直接比對數據間關聯</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Console 提示 -->
    <div class="console-hint">
      🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 查看不同監聽器的觸發記錄！
    </div>
  </div>
</template>

<style scoped>
.multiple-sources-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
  line-height: 1.5;
}

.description code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.current-data-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  border-radius: 12px;
}

.current-data-section h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
}

.data-display {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.data-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  flex: 1;
  min-width: 150px;
}

.data-label {
  font-weight: bold;
  opacity: 0.8;
}

.data-value {
  font-weight: bold;
  font-size: 18px;
  margin-left: 8px;
}

.name-value {
  color: #fdcb6e;
}

.age-value {
  color: #fd79a8;
}

.city-value {
  color: #a29bfe;
}

.example-section {
  margin-bottom: 25px;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  background: #f8f9fa;
}

.batch-section {
  border-color: #ff7675;
  background: #fff5f5;
}

.example-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 18px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  font-size: 14px;
  min-width: 120px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
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

.learning-tip ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.learning-tip li {
  margin-bottom: 4px;
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

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.comparison-item {
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.comparison-item h4 {
  margin: 0 0 10px 0;
  color: #007bff;
}

.comparison-item code {
  display: block;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 10px 0;
  word-break: break-all;
}

.comparison-item ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.comparison-item li {
  margin-bottom: 6px;
  font-size: 14px;
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
  .data-display {
    flex-direction: column;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .btn {
    min-width: auto;
  }
}
</style>
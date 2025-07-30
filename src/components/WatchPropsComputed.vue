<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, computed, watch, toRefs } from "vue";

// ==================== 學習重點 ====================
// 1. 使用 toRefs 將 props 轉換為響應式引用才能被 watch
// 2. computed 屬性本身就是響應式的，可以直接監聽
// 3. watch 可以監聽 getter 函數來監聽複雜的依賴關係
// 4. props 變化會觸發子組件的重新渲染和 watch

// 定義 props
const props = defineProps({
	userName: {
		type: String,
		default: "訪客",
	},
	userAge: {
		type: Number,
		default: 18,
	},
	userCity: {
		type: String,
		default: "台北",
	},
});

// ==================== 使用 toRefs 轉換 props ====================
// 💡 重要：直接監聽 props.userName 不會有響應性
// 必須使用 toRefs 轉換為響應式引用
const { userName, userAge, userCity } = toRefs(props);

// ==================== 建立本地響應式數據 ====================
const localCounter = ref(0);
const localMessage = ref("Hello");

// ==================== Computed 屬性 ====================
// 基於 props 的計算屬性
const userInfo = computed(() => {
	return `${props.userName} (${props.userAge}歲) 來自${props.userCity}`;
});

// 基於本地數據的計算屬性
const counterStatus = computed(() => {
	if (localCounter.value === 0) return "起始狀態";
	if (localCounter.value > 0) return `正數 (+${localCounter.value})`;
	return `負數 (${localCounter.value})`;
});

// 複合計算屬性 - 結合 props 和本地數據
const complexComputed = computed(() => {
	const ageGroup =
		props.userAge < 30 ? "年輕" : props.userAge < 50 ? "中年" : "資深";
	return `${ageGroup}的${props.userName}，計數器狀態：${counterStatus.value}`;
});

// ==================== 監聽 Props ====================
// 監聽單一 prop (使用 toRefs)
watch(userName, (newName, oldName) => {
	console.log(`👤 Props 監聽 - 用戶名稱變化：`);
	console.log(`   舊名稱："${oldName}"`);
	console.log(`   新名稱："${newName}"`);
	console.log(`   名稱長度：${oldName?.length || 0} → ${newName?.length || 0}`);
	console.log("-------------------");
});

watch(userAge, (newAge, oldAge) => {
	console.log(`🎂 Props 監聽 - 年齡變化：`);
	console.log(`   年齡變化：${oldAge} → ${newAge} 歲`);
	console.log(`   ${newAge > oldAge ? "🎈 年齡增長" : "⏰ 年齡調整"}`);
	console.log("-------------------");
});

// 監聽多個 props
watch(
	[userName, userAge, userCity],
	([newName, newAge, newCity], [oldName, oldAge, oldCity]) => {
		console.log(`📋 Props 監聽 - 用戶資料變化：`);
		console.log(`   舊資料：${oldName}, ${oldAge}歲，${oldCity}`);
		console.log(`   新資料：${newName}, ${newAge}歲，${newCity}`);
		console.log("===================");
	}
);

// ==================== 監聽 Computed ====================
// 監聽簡單的 computed 屬性
watch(userInfo, (newInfo, oldInfo) => {
	console.log(`ℹ️ Computed 監聽 - 用戶資訊變化：`);
	console.log(`   舊資訊："${oldInfo}"`);
	console.log(`   新資訊："${newInfo}"`);
	console.log("-------------------");
});

watch(counterStatus, (newStatus, oldStatus) => {
	console.log(`📊 Computed 監聽 - 計數器狀態變化：`);
	console.log(`   狀態變化："${oldStatus}" → "${newStatus}"`);
	console.log("-------------------");
});

// 監聽複合 computed 屬性
watch(complexComputed, (newValue, oldValue) => {
	console.log(`🔄 Computed 監聽 - 複合計算變化：`);
	console.log(`   舊值："${oldValue}"`);
	console.log(`   新值："${newValue}"`);
	console.log("===================");
});

// ==================== 使用 Getter 函數監聽 ====================
// 這是另一種監聽 props 的方式
watch(
	() => props.userName,
	(newName, oldName) => {
		console.log(`🔍 Getter 監聽 - 直接監聽 props.userName：`);
		console.log(`   變化：${oldName} → ${newName}`);
		console.log("-------------------");
	}
);

// 監聽複雜的 getter 函數
watch(
	() => props.userName.length + props.userAge,
	(newSum, oldSum) => {
		console.log(`🧮 Getter 監聽 - 名稱長度 + 年齡：`);
		console.log(`   計算結果：${oldSum} → ${newSum}`);
		console.log(
			`   (名稱長度：${props.userName.length}, 年齡：${props.userAge})`
		);
		console.log("-------------------");
	}
);

// ==================== 本地數據操作函數 ====================
function incrementCounter() {
	localCounter.value++;
}

function decrementCounter() {
	localCounter.value--;
}

function resetCounter() {
	localCounter.value = 0;
}

function updateMessage() {
	const messages = ["Hello", "Hi", "你好", "Bonjour", "Hola", "Guten Tag"];
	const current = messages.indexOf(localMessage.value);
	const available = messages.filter((_, index) => index !== current);
	const randomIndex = Math.floor(Math.random() * available.length);
	localMessage.value = available[randomIndex];
}

// ==================== 發送事件給父組件 ====================
const emit = defineEmits(["update-user", "counter-changed"]);

// 建議父組件更新用戶資料
function suggestUserUpdate() {
	const suggestions = [
		{ userName: "李小華", userAge: 25, userCity: "台中" },
		{ userName: "王大明", userAge: 35, userCity: "高雄" },
		{ userName: "陳美麗", userAge: 28, userCity: "台南" },
		{ userName: "張偉強", userAge: 42, userCity: "桃園" },
	];
	const randomSuggestion =
		suggestions[Math.floor(Math.random() * suggestions.length)];
	emit("update-user", randomSuggestion);
}

// 監聽本地計數器變化並發送事件
watch(localCounter, (newValue) => {
	emit("counter-changed", newValue);
});
</script>

<template>
	<div class="props-computed-container">
		<!-- 標題區域 -->
		<div class="section-header">
			<h2>🔗 監聽 Props 和 Computed</h2>
			<p class="description">
				學習如何監聽<strong>父組件傳入的 props</strong> 和<strong
					>計算屬性 computed</strong
				>，了解 <code>toRefs</code> 的重要性和 getter 函數的使用
			</p>
		</div>

		<!-- Props 資料展示 -->
		<div class="props-display-section">
			<h3>📥 來自父組件的 Props</h3>
			<div class="props-grid">
				<div class="prop-item">
					<span class="prop-label">用戶名稱：</span>
					<span class="prop-value">{{ userName }}</span>
				</div>
				<div class="prop-item">
					<span class="prop-label">年齡：</span>
					<span class="prop-value">{{ userAge }} 歲</span>
				</div>
				<div class="prop-item">
					<span class="prop-label">城市：</span>
					<span class="prop-value">{{ userCity }}</span>
				</div>
			</div>
			<div class="button-group">
				<button @click="suggestUserUpdate" class="btn btn-primary">
					🎲 建議父組件更新用戶資料
				</button>
			</div>
		</div>

		<!-- Computed 屬性展示 -->
		<div class="computed-section">
			<h3>🧮 Computed 計算屬性</h3>
			<div class="computed-grid">
				<div class="computed-item">
					<h4>基於 Props 的計算屬性</h4>
					<div class="computed-value">{{ userInfo }}</div>
				</div>
				<div class="computed-item">
					<h4>基於本地數據的計算屬性</h4>
					<div class="computed-value">{{ counterStatus }}</div>
				</div>
				<div class="computed-item complex">
					<h4>複合計算屬性</h4>
					<div class="computed-value">{{ complexComputed }}</div>
				</div>
			</div>
		</div>

		<!-- 本地數據操作 -->
		<div class="local-data-section">
			<h3>🏠 本地響應式數據</h3>
			<div class="local-data-grid">
				<div class="data-item">
					<span class="data-label">計數器：</span>
					<span class="data-value counter-value">{{ localCounter }}</span>
					<div class="button-group">
						<button @click="decrementCounter" class="btn btn-sm btn-danger">
							-1
						</button>
						<button @click="incrementCounter" class="btn btn-sm btn-success">
							+1
						</button>
						<button @click="resetCounter" class="btn btn-sm btn-secondary">
							重置
						</button>
					</div>
				</div>
				<div class="data-item">
					<span class="data-label">訊息：</span>
					<span class="data-value message-value">{{ localMessage }}</span>
					<div class="button-group">
						<button @click="updateMessage" class="btn btn-sm btn-info">
							更換訊息
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 監聽方式說明 -->
		<div class="concept-section">
			<h3>📚 重要概念說明</h3>
			<div class="concept-grid">
				<div class="concept-item">
					<h4>🔧 toRefs 的使用</h4>
					<pre><code>const { userName } = toRefs(props)
watch(userName, callback)</code></pre>
					<p>將 props 轉換為響應式引用，才能被 watch 正確監聽</p>
				</div>

				<div class="concept-item">
					<h4>🎯 Computed 監聽</h4>
					<pre><code>const userInfo = computed(...)
watch(userInfo, callback)</code></pre>
					<p>computed 本身就是響應式的，可以直接監聽</p>
				</div>

				<div class="concept-item">
					<h4>⚡ Getter 函數</h4>
					<pre><code>watch(() => props.userName, callback)</code></pre>
					<p>使用 getter 函數是另一種監聽 props 的方式</p>
				</div>

				<div class="concept-item">
					<h4>🔍 複雜依賴</h4>
					<pre><code>watch(() => props.a + props.b, callback)</code></pre>
					<p>可以監聽複雜的計算結果變化</p>
				</div>
			</div>
		</div>

		<!-- 學習提示 -->
		<div class="learning-tips">
			<h3>💡 學習重點提示</h3>
			<ul>
				<li>
					<strong>Props 監聽：</strong>必須使用 <code>toRefs(props)</code> 或
					getter 函數
				</li>
				<li>
					<strong>Computed 監聽：</strong>computed
					屬性可以直接監聽，依賴變化會觸發
				</li>
				<li><strong>複合監聽：</strong>可以同時監聽 props 和本地數據的組合</li>
				<li>
					<strong>最佳實踐：</strong
					>父子組件數據流應該是單向的，子組件通過事件通知父組件
				</li>
			</ul>
		</div>

		<!-- Console 提示 -->
		<div class="console-hint">
			🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 查看 props 和 computed
			的監聽記錄！
		</div>
	</div>
</template>

<style scoped>
.props-computed-container {
	max-width: 1000px;
	margin: 0 auto;
	padding: 20px;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.section-header {
	text-align: center;
	margin-bottom: 30px;
	padding: 20px;
	background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
	color: #2c3e50;
	border-radius: 12px;
}

.section-header h2 {
	margin: 0 0 10px 0;
	font-size: 28px;
}

.description {
	margin: 0;
	font-size: 16px;
	line-height: 1.5;
}

.description code {
	background: rgba(255, 255, 255, 0.3);
	padding: 2px 6px;
	border-radius: 4px;
	font-weight: bold;
}

.props-display-section {
	margin-bottom: 30px;
	padding: 20px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 12px;
}

.props-display-section h3 {
	margin: 0 0 15px 0;
	font-size: 20px;
}

.props-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 15px;
	margin-bottom: 20px;
}

.prop-item {
	background: rgba(255, 255, 255, 0.15);
	padding: 12px 16px;
	border-radius: 8px;
	text-align: center;
}

.prop-label {
	display: block;
	font-size: 14px;
	opacity: 0.8;
	margin-bottom: 5px;
}

.prop-value {
	font-weight: bold;
	font-size: 18px;
}

.computed-section {
	margin-bottom: 30px;
	padding: 20px;
	background: #f8f9fa;
	border-radius: 12px;
	border: 2px solid #e9ecef;
}

.computed-section h3 {
	margin: 0 0 15px 0;
	color: #2c3e50;
}

.computed-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 15px;
}

.computed-item {
	background: white;
	padding: 15px;
	border-radius: 8px;
	border-left: 4px solid #28a745;
}

.computed-item.complex {
	border-left-color: #ffc107;
	grid-column: 1 / -1;
}

.computed-item h4 {
	margin: 0 0 10px 0;
	font-size: 16px;
	color: #495057;
}

.computed-value {
	font-weight: bold;
	color: #28a745;
	font-size: 16px;
}

.local-data-section {
	margin-bottom: 30px;
	padding: 20px;
	background: #fff3cd;
	border-radius: 12px;
	border: 2px solid #ffeaa7;
}

.local-data-section h3 {
	margin: 0 0 15px 0;
	color: #856404;
}

.local-data-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}

.data-item {
	background: white;
	padding: 15px;
	border-radius: 8px;
	text-align: center;
}

.data-label {
	display: block;
	font-weight: bold;
	margin-bottom: 8px;
	color: #495057;
}

.data-value {
	display: block;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 12px;
}

.counter-value {
	color: #007bff;
}

.message-value {
	color: #17a2b8;
}

.button-group {
	display: flex;
	gap: 8px;
	justify-content: center;
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
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
	background: #007bff;
	color: white;
}

.btn-success {
	background: #28a745;
	color: white;
}

.btn-danger {
	background: #dc3545;
	color: white;
}

.btn-info {
	background: #17a2b8;
	color: white;
}

.btn-secondary {
	background: #6c757d;
	color: white;
}

.concept-section {
	margin-bottom: 30px;
	padding: 20px;
	background: #e8f4fd;
	border-radius: 12px;
}

.concept-section h3 {
	margin: 0 0 20px 0;
	color: #2c3e50;
}

.concept-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 15px;
}

.concept-item {
	background: white;
	padding: 15px;
	border-radius: 8px;
	border-left: 4px solid #007bff;
}

.concept-item h4 {
	margin: 0 0 10px 0;
	color: #007bff;
	font-size: 16px;
}

.concept-item pre {
	background: #f8f9fa;
	padding: 10px;
	border-radius: 4px;
	margin: 10px 0;
	font-size: 12px;
	overflow-x: auto;
}

.concept-item p {
	margin: 0;
	font-size: 14px;
	color: #495057;
	line-height: 1.4;
}

.learning-tips {
	margin-bottom: 20px;
	padding: 20px;
	background: #d1ecf1;
	border-radius: 10px;
	border: 1px solid #bee5eb;
}

.learning-tips h3 {
	margin: 0 0 15px 0;
	color: #0c5460;
}

.learning-tips ul {
	margin: 0;
	padding-left: 20px;
}

.learning-tips li {
	margin-bottom: 8px;
	line-height: 1.5;
}

.learning-tips code {
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
	.props-grid,
	.computed-grid,
	.local-data-grid,
	.concept-grid {
		grid-template-columns: 1fr;
	}

	.computed-item.complex {
		grid-column: 1;
	}
}
</style>

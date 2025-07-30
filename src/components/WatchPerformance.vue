<script setup>
// 匯入 Vue 3 Composition API 所需的函數
import { ref, watch, computed, onUnmounted } from "vue";

// ==================== 學習重點 ====================
// 1. Race Condition：多個異步操作競爭，可能導致結果不一致
// 2. 防抖動 (Debounce)：延遲執行，避免頻繁觸發
// 3. AbortController：取消已發出的請求
// 4. 效能優化：避免不必要的監聽和計算

// 搜尋相關數據
const searchTerm = ref("");
const searchResults = ref([]);
const isLoading = ref(false);
const requestCount = ref(0);
const errorMessage = ref("");

// 防抖動相關
const debouncedSearchTerm = ref("");
const debounceTimeout = ref(null);

// Race Condition 示範相關
const raceResults = ref([]);
const raceRequestCount = ref(0);

// 效能測試相關
const heavyComputationInput = ref(1);
const computationResults = ref([]);

// ==================== Race Condition 問題示範 ====================
// 🚨 有問題的版本：可能出現 Race Condition
watch(searchTerm, async (newTerm) => {
	if (!newTerm.trim()) {
		raceResults.value = [];
		return;
	}

	raceRequestCount.value++;
	const currentRequestId = raceRequestCount.value;

	console.log(`🚨 Race Condition 示範 - 發起請求 #${currentRequestId}：`);
	console.log(`   搜尋詞："${newTerm}"`);
	console.log(`   請求 ID：${currentRequestId}`);

	try {
		// 模擬 API 請求 - 隨機延遲
		const delay = Math.random() * 2000 + 500; // 500-2500ms
		const results = await fakeApiCall(newTerm, delay);

		console.log(`📨 Race Condition - 請求 #${currentRequestId} 完成：`);
		console.log(`   搜尋詞："${newTerm}"`);
		console.log(`   延遲：${Math.round(delay)}ms`);
		console.log(`   結果：`, results);

		// ⚠️ 問題：可能舊的請求後完成，覆蓋新的結果
		raceResults.value = results;
		console.log(`   ⚠️ 結果已更新 (可能不是最新的搜尋詞)`);
	} catch (error) {
		console.error(
			`❌ Race Condition - 請求 #${currentRequestId} 失敗：`,
			error
		);
	}

	console.log("-------------------");
});

// ==================== AbortController 解決方案 ====================
let abortController = null;

// ✅ 正確的版本：使用 AbortController 避免 Race Condition
watch(searchTerm, async (newTerm) => {
	// 取消前一個請求
	if (abortController) {
		abortController.abort();
		console.log(`🛑 取消前一個搜尋請求`);
	}

	if (!newTerm.trim()) {
		searchResults.value = [];
		isLoading.value = false;
		errorMessage.value = "";
		return;
	}

	requestCount.value++;
	const currentRequestId = requestCount.value;

	// 創建新的 AbortController
	abortController = new AbortController();

	console.log("abortController", abortController);
	isLoading.value = true;
	errorMessage.value = "";

	console.log(`✅ 正確實作 - 發起請求 #${currentRequestId}：`);
	console.log(`   搜尋詞："${newTerm}"`);
	console.log(`   請求 ID：${currentRequestId}`);

	try {
		const delay = Math.random() * 2000 + 500;
		const results = await fakeApiCall(newTerm, delay, abortController.signal);

		console.log(`📨 正確實作 - 請求 #${currentRequestId} 完成：`);
		console.log(`   搜尋詞："${newTerm}"`);
		console.log(`   延遲：${Math.round(delay)}ms`);
		console.log(`   結果：`, results);

		searchResults.value = results;
		isLoading.value = false;
	} catch (error) {
		if (error.name === "AbortError") {
			console.log(`🛑 正確實作 - 請求 #${currentRequestId} 被取消`);
		} else {
			console.error(`❌ 正確實作 - 請求 #${currentRequestId} 失敗：`, error);
			errorMessage.value = `搜尋失敗：${error.message}`;
			isLoading.value = false;
		}
	}

	console.log("===================");
});

// ==================== 防抖動 (Debounce) 實作 ====================
// 防抖動邏輯
watch(searchTerm, (newTerm) => {
	// 清除之前的 timeout
	if (debounceTimeout.value) {
		clearTimeout(debounceTimeout.value);
	}

	// 設定新的 timeout
	debounceTimeout.value = setTimeout(() => {
		debouncedSearchTerm.value = newTerm;
		console.log(`🕒 防抖動觸發 (300ms 延遲)："${newTerm}"`);
	}, 300); // 300ms 防抖動
});

// 監聽防抖動後的搜尋詞
watch(debouncedSearchTerm, async (newTerm) => {
	if (!newTerm.trim()) return;

	console.log(`🔍 防抖動搜尋執行：`);
	console.log(`   搜尋詞："${newTerm}"`);
	console.log(`   說明：用戶停止輸入 300ms 後才執行`);
	console.log("-------------------");
});

// ==================== 效能優化示範 ====================
// 🚨 有問題的計算：每次都重新計算
const expensiveComputation = computed(() => {
	console.log(`💻 執行昂貴計算 (input: ${heavyComputationInput.value})`);

	// 模擬複雜計算
	let result = 0;
	for (let i = 0; i < heavyComputationInput.value * 1000000; i++) {
		result += Math.random();
	}

	const finalResult = Math.round(result);
	console.log(`   計算結果：${finalResult}`);
	return finalResult;
});

// ✅ 優化版本：使用 watch 控制計算時機
let computationTimeout = null;

watch(heavyComputationInput, (newValue) => {
	// 清除之前的計算 timeout
	if (computationTimeout) {
		clearTimeout(computationTimeout);
	}

	// 延遲計算，避免頻繁觸發
	computationTimeout = setTimeout(() => {
		console.log(`⚡ 優化計算執行 (input: ${newValue})`);

		const startTime = performance.now();
		let result = 0;

		for (let i = 0; i < newValue * 100000; i++) {
			result += Math.random();
		}

		const endTime = performance.now();
		const duration = Math.round(endTime - startTime);
		const finalResult = Math.round(result);

		computationResults.value.unshift({
			input: newValue,
			result: finalResult,
			duration: `${duration}ms`,
			timestamp: new Date().toLocaleTimeString(),
		});

		// 限制結果數量
		if (computationResults.value.length > 10) {
			computationResults.value.pop();
		}

		console.log(`   優化計算完成：${finalResult} (耗時：${duration}ms)`);
	}, 500); // 500ms 延遲
});

// ==================== 工具函數 ====================
// 模擬 API 請求
async function fakeApiCall(searchTerm, delay = 1000, signal = null) {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			// 模擬搜尋結果
			const results = [
				`${searchTerm} 相關結果 1`,
				`${searchTerm} 相關結果 2`,
				`${searchTerm} 相關結果 3`,
				`關於 ${searchTerm} 的更多資訊`,
				`${searchTerm} - 深入了解`,
			];
			resolve(results);
		}, delay);

		// 支援 AbortController
		if (signal) {
			signal.addEventListener("abort", () => {
				clearTimeout(timeout);
				reject(new DOMException("請求被取消", "AbortError"));
			});
		}
	});
}

// ==================== 操作函數 ====================
function clearSearchResults() {
	searchResults.value = [];
	raceResults.value = [];
	searchTerm.value = "";
	errorMessage.value = "";
}

function triggerRapidSearch() {
	const terms = ["Vue", "React", "Angular", "JavaScript", "TypeScript"];
	let index = 0;

	const interval = setInterval(() => {
		if (index >= terms.length) {
			clearInterval(interval);
			return;
		}

		searchTerm.value = terms[index];
		index++;
	}, 200); // 每 200ms 更換一次搜尋詞
}

function increaseComputation() {
	heavyComputationInput.value++;
}

function decreaseComputation() {
	if (heavyComputationInput.value > 1) {
		heavyComputationInput.value--;
	}
}

function rapidComputationChange() {
	// 快速連續改變輸入值，測試防抖動效果
	for (let i = 1; i <= 10; i++) {
		setTimeout(() => {
			heavyComputationInput.value = Math.floor(Math.random() * 10) + 1;
		}, i * 100); // 每 100ms 改變一次
	}
}

function clearComputationResults() {
	computationResults.value = [];
}

// ==================== 組件清理 ====================
// 在組件卸載時清理所有未完成的異步操作和計時器
onUnmounted(() => {
	console.log("🧹 組件卸載，清理資源...");
	
	// 取消未完成的 API 請求
	if (abortController) {
		abortController.abort();
		console.log("   ✅ 已取消未完成的 API 請求");
	}
	
	// 清理防抖動計時器
	if (debounceTimeout.value) {
		clearTimeout(debounceTimeout.value);
		console.log("   ✅ 已清理防抖動計時器");
	}
	
	// 清理計算延遲計時器
	if (computationTimeout) {
		clearTimeout(computationTimeout);
		console.log("   ✅ 已清理計算延遲計時器");
	}
	
	console.log("🎯 資源清理完成");
});
</script>

<template>
	<div class="watch-performance-container">
		<!-- 標題區域 -->
		<div class="section-header">
			<h2>⚡ Watch 效能優化與陷阱</h2>
			<p class="description">
				學習 <strong>Race Condition</strong> 問題、<strong>防抖動</strong>優化、
				<strong>AbortController</strong> 使用，以及 watch 的效能最佳實踐
			</p>
		</div>

		<!-- Race Condition 示範 -->
		<div class="example-section race-section">
			<h3>🏃‍♂️ Race Condition 問題與解決</h3>
			<div class="race-explanation">
				<p>
					<strong>問題：</strong
					>當用戶快速輸入時，較舊的請求可能在較新的請求之後完成，導致顯示錯誤的結果。
				</p>
				<p>
					<strong>解決：</strong>使用 AbortController
					取消前一個請求，確保只顯示最新的搜尋結果。
				</p>
			</div>

			<div class="search-section">
				<div class="search-input-group">
					<input
						v-model="searchTerm"
						type="text"
						placeholder="輸入搜尋關鍵字..."
						class="search-input"
					/>
					<div class="search-controls">
						<button @click="clearSearchResults" class="btn btn-secondary">
							清空結果
						</button>
						<button @click="triggerRapidSearch" class="btn btn-warning">
							快速連續搜尋
						</button>
					</div>
				</div>

				<div class="search-status">
					<div v-if="isLoading" class="loading-status">
						🔄 搜尋中... (請求 #{{ requestCount }})
					</div>
					<div v-if="errorMessage" class="error-status">
						❌ {{ errorMessage }}
					</div>
				</div>
			</div>

			<div class="results-comparison">
				<div class="result-panel">
					<h4>✅ 正確實作 (使用 AbortController)</h4>
					<div class="result-list">
						<div
							v-if="searchResults.length === 0 && !isLoading"
							class="no-results"
						>
							尚無搜尋結果
						</div>
						<div
							v-for="(result, index) in searchResults"
							:key="`correct-${index}`"
							class="result-item correct"
						>
							{{ result }}
						</div>
					</div>
				</div>

				<div class="result-panel">
					<h4>🚨 有問題的實作 (Race Condition)</h4>
					<div class="result-list">
						<div v-if="raceResults.length === 0" class="no-results">
							尚無搜尋結果
						</div>
						<div
							v-for="(result, index) in raceResults"
							:key="`race-${index}`"
							class="result-item problematic"
						>
							{{ result }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 防抖動示範 -->
		<div class="example-section debounce-section">
			<h3>🕒 防抖動 (Debounce) 優化</h3>
			<div class="debounce-explanation">
				<p>
					<strong>概念：</strong
					>延遲執行操作，直到用戶停止操作一段時間後才執行，避免頻繁觸發。
				</p>
				<p>
					<strong>效果：</strong>用戶停止輸入 300ms 後才執行搜尋，大幅減少 API
					請求次數。
				</p>
			</div>

			<div class="debounce-demo">
				<div class="input-comparison">
					<div class="input-group">
						<label>即時輸入值：</label>
						<div class="input-value">{{ searchTerm || "(空白)" }}</div>
					</div>
					<div class="input-group">
						<label>防抖動後的值：</label>
						<div class="input-value debounced">
							{{ debouncedSearchTerm || "(空白)" }}
						</div>
					</div>
				</div>
				<div class="debounce-tip">
					💡 觀察兩個值的變化差異，以及 Console 中的觸發記錄
				</div>
			</div>
		</div>

		<!-- 效能優化示範 -->
		<div class="example-section performance-section">
			<h3>💻 效能優化示範</h3>
			<div class="performance-explanation">
				<p>
					<strong>問題：</strong>computed
					在每次依賴變化時都會重新計算，如果計算很昂貴會影響效能。
				</p>
				<p>
					<strong>優化：</strong>使用 watch +
					防抖動控制計算時機，減少不必要的計算。
				</p>
			</div>

			<div class="computation-controls">
				<div class="input-controls">
					<label>計算輸入值 (影響計算複雜度)：</label>
					<div class="number-input-group">
						<button @click="decreaseComputation" class="btn btn-sm btn-danger">
							-
						</button>
						<span class="number-display">{{ heavyComputationInput }}</span>
						<button @click="increaseComputation" class="btn btn-sm btn-success">
							+
						</button>
					</div>
					<div class="button-group">
						<button @click="rapidComputationChange" class="btn btn-warning">
							快速連續變更
						</button>
						<button @click="clearComputationResults" class="btn btn-secondary">
							清空結果
						</button>
					</div>
				</div>

				<div class="computation-status">
					<div class="status-item">
						<span class="status-label">Computed 結果：</span>
						<span class="status-value">{{ expensiveComputation }}</span>
					</div>
				</div>
			</div>

			<div class="computation-results">
				<h4>⚡ 優化計算記錄</h4>
				<div v-if="computationResults.length === 0" class="no-results">
					尚無計算記錄，試著改變輸入值
				</div>
				<div class="result-timeline">
					<div
						v-for="(result, index) in computationResults"
						:key="`comp-${index}`"
						class="computation-item"
					>
						<div class="computation-header">
							<span class="computation-time">{{ result.timestamp }}</span>
							<span class="computation-duration">{{ result.duration }}</span>
						</div>
						<div class="computation-details">
							輸入：{{ result.input }} → 結果：{{ result.result }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 最佳實踐指南 -->
		<div class="best-practices-section">
			<h3>💡 Watch 效能最佳實踐</h3>
			<div class="practices-grid">
				<div class="practice-card">
					<h4>🛡️ 避免 Race Condition</h4>
					<ul>
						<li>使用 <code>AbortController</code> 取消前一個請求</li>
						<li>為每個請求分配唯一 ID 進行追蹤</li>
						<li>在組件卸載時清理未完成的請求</li>
						<li>考慮使用狀態管理來協調異步操作</li>
					</ul>
				</div>

				<div class="practice-card">
					<h4>🕒 實作防抖動</h4>
					<ul>
						<li>使用 <code>setTimeout</code> 延遲執行操作</li>
						<li>在新操作前清除舊的 <code>timeout</code></li>
						<li>選擇合適的延遲時間 (通常 200-500ms)</li>
						<li>考慮使用 lodash 的 debounce 函數</li>
					</ul>
				</div>

				<div class="practice-card">
					<h4>⚡ 效能優化</h4>
					<ul>
						<li>避免在 watch 中執行昂貴的同步操作</li>
						<li>合理使用 <code>deep</code> 選項，避免不必要的深度監聽</li>
						<li>考慮使用 <code>computed</code> 替代複雜的 watch 邏輯</li>
						<li>在組件卸載時清理所有監聽器</li>
					</ul>
				</div>

				<div class="practice-card">
					<h4>🔄 記憶體管理</h4>
					<ul>
						<li>及時清理不再需要的監聽器</li>
						<li>避免在監聽器中創建循環引用</li>
						<li>限制記錄陣列的長度，防止記憶體洩漏</li>
						<li>使用 <code>onUnmounted</code> 進行清理</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 問題檢查清單 -->
		<div class="checklist-section">
			<h3>✅ Watch 問題檢查清單</h3>
			<div class="checklist-grid">
				<div class="checklist-category">
					<h4>🔍 功能性問題</h4>
					<div class="checklist-items">
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否會出現 Race Condition？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否正確處理異步操作的錯誤？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否在組件卸載時清理資源？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>監聽器是否會無限循環觸發？</span>
						</div>
					</div>
				</div>

				<div class="checklist-category">
					<h4>⚡ 效能問題</h4>
					<div class="checklist-items">
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否使用了不必要的深度監聽？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否頻繁觸發昂貴的操作？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>是否考慮使用防抖動優化？</span>
						</div>
						<div class="checklist-item">
							<span class="checkbox">☐</span>
							<span>監聽器數量是否過多？</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Console 提示 -->
		<div class="console-hint">
			🖥️ <strong>開啟瀏覽器 Console (F12)</strong> 觀察 Race Condition
			和效能優化的詳細記錄！
		</div>
	</div>
</template>

<style scoped>
.watch-performance-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.section-header {
	text-align: center;
	margin-bottom: 30px;
	padding: 20px;
	background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
	color: #2c3e50;
	border-radius: 12px;
}

.example-section {
	margin-bottom: 30px;
	padding: 20px;
	border-radius: 12px;
	border: 2px solid #dee2e6;
}

.race-section {
	background: #fff5f5;
	border-color: #fed7d7;
}

.debounce-section {
	background: #fffaf0;
	border-color: #feebc8;
}

.performance-section {
	background: #f0fff4;
	border-color: #c6f6d5;
}

.example-section h3 {
	margin: 0 0 15px 0;
	color: #2c3e50;
}

.race-explanation,
.debounce-explanation,
.performance-explanation {
	background: rgba(255, 255, 255, 0.8);
	padding: 15px;
	border-radius: 8px;
	margin-bottom: 20px;
	border-left: 4px solid #007bff;
}

.race-explanation {
	border-left-color: #dc3545;
}

.debounce-explanation {
	border-left-color: #ffc107;
}

.performance-explanation {
	border-left-color: #28a745;
}

.search-section {
	margin-bottom: 20px;
}

.search-input-group {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	align-items: center;
	margin-bottom: 15px;
}

.search-input {
	flex: 1;
	min-width: 250px;
	padding: 10px 15px;
	border: 2px solid #e9ecef;
	border-radius: 8px;
	font-size: 16px;
}

.search-input:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-controls {
	display: flex;
	gap: 8px;
}

.search-status {
	min-height: 30px;
	display: flex;
	align-items: center;
}

.loading-status {
	color: #007bff;
	font-weight: bold;
}

.error-status {
	color: #dc3545;
	font-weight: bold;
}

.results-comparison {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
}

.result-panel {
	background: white;
	border-radius: 8px;
	padding: 15px;
	border: 2px solid #e9ecef;
}

.result-panel h4 {
	margin: 0 0 15px 0;
	font-size: 16px;
}

.result-list {
	max-height: 200px;
	overflow-y: auto;
}

.result-item {
	padding: 8px 12px;
	margin-bottom: 6px;
	border-radius: 6px;
	font-size: 14px;
	border-left: 4px solid;
}

.result-item.correct {
	background: #d4edda;
	border-left-color: #28a745;
	color: #155724;
}

.result-item.problematic {
	background: #f8d7da;
	border-left-color: #dc3545;
	color: #721c24;
}

.no-results {
	text-align: center;
	color: #6c757d;
	font-style: italic;
	padding: 20px;
}

.debounce-demo {
	background: white;
	border-radius: 8px;
	padding: 20px;
}

.input-comparison {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 20px;
	margin-bottom: 15px;
}

.input-group {
	text-align: center;
}

.input-group label {
	display: block;
	font-weight: bold;
	margin-bottom: 8px;
	color: #495057;
}

.input-value {
	padding: 10px 15px;
	background: #f8f9fa;
	border: 2px solid #e9ecef;
	border-radius: 6px;
	font-family: monospace;
	min-height: 20px;
}

.input-value.debounced {
	border-color: #ffc107;
	background: #fff3cd;
}

.debounce-tip {
	text-align: center;
	color: #856404;
	font-style: italic;
	background: #fff3cd;
	padding: 10px;
	border-radius: 6px;
}

.computation-controls {
	background: white;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 20px;
}

.input-controls {
	margin-bottom: 15px;
}

.input-controls label {
	display: block;
	font-weight: bold;
	margin-bottom: 10px;
	color: #495057;
}

.number-input-group {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 15px;
}

.number-display {
	font-size: 24px;
	font-weight: bold;
	color: #007bff;
	min-width: 40px;
	text-align: center;
}

.computation-status {
	padding: 15px;
	background: #e8f5e8;
	border-radius: 6px;
	border-left: 4px solid #28a745;
}

.status-item {
	display: flex;
	align-items: center;
	gap: 10px;
}

.status-label {
	font-weight: bold;
	color: #495057;
}

.status-value {
	font-size: 18px;
	font-weight: bold;
	color: #28a745;
}

.computation-results {
	background: white;
	border-radius: 8px;
	padding: 20px;
}

.computation-results h4 {
	margin: 0 0 15px 0;
	color: #2c3e50;
}

.result-timeline {
	max-height: 300px;
	overflow-y: auto;
}

.computation-item {
	background: #f8f9fa;
	border-radius: 6px;
	border-left: 4px solid #17a2b8;
	padding: 12px;
	margin-bottom: 8px;
}

.computation-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
}

.computation-time {
	font-size: 12px;
	color: #6c757d;
}

.computation-duration {
	font-size: 12px;
	font-weight: bold;
	color: #17a2b8;
}

.computation-details {
	font-size: 14px;
	color: #495057;
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
.btn-warning {
	background: #ffc107;
	color: #212529;
}
.btn-info {
	background: #17a2b8;
	color: white;
}
.btn-secondary {
	background: #6c757d;
	color: white;
}

.button-group {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.best-practices-section,
.checklist-section {
	margin-bottom: 30px;
	padding: 20px;
	background: #e8f4fd;
	border-radius: 12px;
}

.practices-grid,
.checklist-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
	margin-top: 15px;
}

.practice-card,
.checklist-category {
	background: white;
	padding: 15px;
	border-radius: 8px;
}

.practice-card h4,
.checklist-category h4 {
	margin: 0 0 15px 0;
	color: #2c3e50;
}

.practice-card ul {
	margin: 0;
	padding-left: 20px;
}

.practice-card li {
	margin-bottom: 8px;
	font-size: 14px;
	line-height: 1.4;
}

.practice-card code {
	background: #f1f3f4;
	padding: 2px 4px;
	border-radius: 3px;
	font-size: 12px;
}

.checklist-items {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.checklist-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	line-height: 1.4;
}

.checkbox {
	font-family: monospace;
	font-weight: bold;
	color: #007bff;
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
	.results-comparison,
	.input-comparison,
	.practices-grid,
	.checklist-grid {
		grid-template-columns: 1fr;
	}

	.search-input-group {
		flex-direction: column;
		align-items: stretch;
	}

	.search-input {
		min-width: auto;
	}

	.number-input-group {
		justify-content: center;
	}
}
</style>

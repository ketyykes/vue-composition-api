# vue-composition-api

此專案為 Vue Composition API 的練習專案。


## 自定義配置

查看 [Vite 配置參考](https://vitejs.dev/config/)。

## 項目設置

```sh
npm install
```

### 運行開發伺服器

```sh
npm run dev
```

### 編譯和壓縮以用於部署

```sh
npm run build
```

## Vue Composition API 練習

本項目包含多個分支，每個分支專注於 Vue Composition API 的不同方面。以下是各個分支的概述：

1. **basciComputed**: 學習如何使用 computed 屬性。

2. **basicReactiveExample**: 探索 reactive 的基本用法。

3. **differentRefAndReactiveAndWatch**: 比較 ref、reactive 和 watch 的區別和使用場景。

4. **refIsProxyObjSoDeclareByConst**: 了解為什麼 ref 是代理對象，以及為什麼應該使用 const 宣告。

5. **refIsReactivityData**: 深入理解 ref 作為響應式數據的特性。

6. **sendComponentMustDefinePropsType**: 學習在發送組件時如何正確定義 props 類型。

7. **sendComponentMustDefinePropsTypeWithSugar**: 使用語法糖來定義組件的 props 類型。

8. **setupNoSugar**: 不使用語法糖的 setup 函式示例。

9. **setupWithSugar**: 使用語法糖的 setup 函式示例。

要查看特定練習，請切換到相應的分支：

```sh
git checkout <branch-name>
```

例如，要查看基本的 computed 屬性示例：

```sh
git checkout basciComputed
```

每個分支都包含相關的代碼示例和註釋，以幫助您更好地理解 Vue Composition API 的各個方面。

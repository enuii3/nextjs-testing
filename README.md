## 1. 空のフォルダ(nestjs-testing)を作成し、VSCodeで開く

## 2. プロジェクトの新規作成

2-1. create-next-app

```jsx
npx create-next-app . --use-npm
```

2-2. 必要なmoduleのインストール

```jsx
npm i axios@0.21.1 msw swr
```

2-3. **prettierの設定を追加**

**package.json:**

```jsx
"prettier": {
  "singleQuote": true,
  "semi": false
}
```

## 3. **React-testing-library の導入**

3-1. 必要なmoduleのインストール

```jsx
npm i -D jest @testing-library/react @types/jest @testing-library/jest-dom @testing-library/dom babel-jest @testing-library/user-event jest-css-modules
```

- `jest-css-module`はテストをする際に、cssが悪さをしないようにモッキングするためのもの

3-2. **Project folder 直下に".babelrc"ファイルを作成して下記設定を追加**

.babelrc:

```jsx
{
    "presets": ["next/babel"]
}
```

- nextjsに対してテストをする事を伝える役割？

3-3. **package.json に jest の設定を追記**

```jsx
"jest": {
    "testPathIgnorePatterns": [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/"
    ],
    "moduleNameMapper": {
        "\\.(css)$": "<rootDir>/node_modules/jest-css-modules"
    }
}
```

- `testPathIgnorePatterns`は`.next`ディレクトリと`node_modules`ディレクトリをテスト対象外にしている
- `moduleNameMapper`はcssを`jest-css-modules`によってモッキングしている

3-4. **package.jsonに test scriptを追記**

```jsx
"scripts": {
    ...
    "test": "jest --env=jsdom --verbose"
},
```

- `npm test`コマンドで`jest`を実行できる様になる
- デフォルトではテストファイルに対してpassしたどうか出力してくれるが、`-env=jsdom --verbose`オプションを追記することによって、`テストケース1つ1つに対して`、出力してくれる様になる

## 4. TypeScriptの導入

4-1. 空のtsconfig.jsonを作成

4-2. 必要なmoduleのインストール

```jsx
npm i -D typescript @types/react @types/node
```

4-3. 開発サーバーを起動

- `npm run dev`を実行することで、構成を自動で認識し、`tsconfig.json`に追記してくれる

4-4. pages/apiフォルダの削除と_app.js, index.js ⇒ tsxへ拡張子を変更

4**-5. AppProps型追記**

```tsx
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp
```

- nestjsが`Appコンポーネント`に対する型を定義してくれているので追記

## **4. Tailwind CSS の導入**

[Installation: Tailwind CSS with Next.js - Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)

### **4-1. 必要moduleのインストール**

```tsx
npm i tailwindcss@latest postcss@latest autoprefixer@latest
```

### **4-2. tailwind.config.js, postcss.config.jsの生成**

```tsx
npx tailwindcss init -p
```

- 上記のコマンドにより、**`tailwind.config.js`**と **`postcss.config.js`**を自動で作成してくれる

### **4-3. tailwind.config.jsのcontent設定追加**

```tsx
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### **4-4. globals.cssの編集**

```tsx
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## **5. 動作確認**

### **5-1. index.tsxの編集**

```tsx
const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen font-mono">
      Hello Nextjs
    </div>
  )
}
export default Home
```

npm run dev -> Tailwind CSSが効いているかブラウザで確認

### **5-2. `__tests__`フォルダと`Home.test.tsx`ファイルの作成**

__tests__/Home.test.tsx:

```tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Home from '../pages/index'

it('Should render hello text', () => {
  render(<Home />)
  expect(screen.getByText('Hello Nextjs')).toBeInTheDocument()
})
```

### **npm test -> テストがPASSするか確認**

```tsx
PASS  __tests__/Home.test.tsx
  ✓ Should render hello text (20 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.728 s, estimated 2 s
```

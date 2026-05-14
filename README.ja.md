# input-form

CSVファイルから動的に生成される、入力バリデーション付きのフォームを作成するための再利用可能なWebコンポーネントです。

## デモ

[ライブデモを見る](https://code4fukui.github.io/input-form/)

## 機能

- **動的フォーム生成**: シンプルなCSV定義から自動的にフォームUIを生成します。
- **豊富な入力タイプ**: `string`、`number`、`date`、`postalcode`、`telephone`、`kana`など、組み込みのバリデーションを備えた幅広い入力タイプをサポートします。
- **複数値フィールド**: `<input-multi>`コンポーネントを使用して、ユーザーが単一のフィールドに複数の値を追加できるようにします。
- **複雑な構造**: 複雑なデータ向けに、ドロップダウン（`enum[...]`）やネストされたフォーム（`vocab[...]`）をサポートします。
- **柔軟な設定**: 各フィールドを必須や読み取り専用に設定したり、文字数制限を設けたりといった設定をCSV内で直接行えます。

## 要件

このプロジェクトは標準のESモジュールインポートを使用しており、モダンWebブラウザが必要です。

## 使い方

### `<input-form>`

これは、完全なフォームを生成するためのメインコンポーネントです。

1.  **コンポーネントをインポートする:**
    ```javascript
    import { InputForm } from "./input-form.js";
    ```

2.  **HTMLに要素を追加し**、ボキャブラリCSVファイルへのパスを指定する:
    ```html
    <input-form id="my-form" vocab="./company.vocab.csv"></input-form>
    ```

3.  **JavaScript経由でフォームを操作する:**
    ```javascript
    const myForm = document.getElementById("my-form");

    // すべてのフォームデータをオブジェクトとして取得
    const data = myForm.value;

    // オブジェクトからフォームデータを設定
    myForm.value = {
      "法人名": "Example Company",
      "設立年月日": "2023-01-01"
    };
    ```

### `<input-multi>`

このコンポーネントは、同じタイプの複数の入力フィールドを可能にします。`count`列が設定されている場合、`<input-form>`によって自動的に使用されますが、単独で使用することもできます。

1.  **コンポーネントをインポートする:**
    ```javascript
    import { InputMulti } from "./input-multi.js";
    ```

2.  **HTMLに要素を追加する:**
    ```html
    <input-multi id="phone-numbers" type="telephone" maxlength="3"></input-multi>
    ```

3.  **JavaScript経由で値（配列）を取得または設定する:**
    ```javascript
    const phoneNumbers = document.getElementById("phone-numbers");

    // 配列として値を取得
    console.log(phoneNumbers.value); // 例: ["090-1111-2222", "090-3333-4444"]

    // 配列から値を設定
    phoneNumbers.value = ["080-5555-6666"];
    ```

## ボキャブラリCSV定義

`<input-form>`コンポーネントはCSVファイルを通じて設定されます。このファイルは、以下の列を使用してフォーム内の各フィールドを定義します:

| 列名          | 説明                                                                                                                                   |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `name_ja`     | UIに表示されるフィールドラベル。`value`オブジェクトのキーとしても使用されます。                                                        |
| `mandatory`   | フィールドが必須の場合は`1`、そうでない場合は`0`を設定します。                                                                         |
| `type`        | 使用するデータ型と入力コントロール。下記の**フィールドタイプ**を参照してください。                                                     |
| `description` | フィールドの説明（将来の拡張用に予約されています）。                                                                                   |
| `url`         | フィールドに関連付けられたURL（将来の拡張用に予約されています）。                                                                      |
|

# input-form

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A reusable web component for creating forms with input validation, dynamically generated from a CSV file.

## Demo

[View the live demo](https://code4fukui.github.io/input-form/)

## Features

- **Dynamic Form Generation**: Automatically creates a form UI from a simple CSV definition.
- **Rich Input Types**: Supports a wide range of input types with built-in validation: `string`, `number`, `date`, `postalcode`, `telephone`, `kana`, and more.
- **Multi-Value Fields**: Allows users to add multiple values for a single field using the `<input-multi>` component.
- **Complex Structures**: Supports dropdowns (`enum[...]`) and nested forms (`vocab[...]`) for complex data.
- **Flexible Configuration**: Configure each field as mandatory, read-only, or set character limits directly in the CSV.

## Requirements

This project uses standard ES module imports and requires a modern web browser.

## Usage

### `<input-form>`

This is the main component for generating a complete form.

1.  **Import the component:**
    ```javascript
    import { InputForm } from "./input-form.js";
    ```

2.  **Add the element to your HTML**, specifying the path to your vocabulary CSV file:
    ```html
    <input-form id="my-form" vocab="./company.vocab.csv"></input-form>
    ```

3.  **Interact with the form via JavaScript:**
    ```javascript
    const myForm = document.getElementById("my-form");

    // Get all form data as an object
    const data = myForm.value;

    // Set form data from an object
    myForm.value = {
      "法人名": "Example Company",
      "設立年月日": "2023-01-01"
    };
    ```

### `<input-multi>`

This component allows for multiple input fields of the same type. It is used automatically by `<input-form>` when the `count` column is set, but can also be used standalone.

1.  **Import the component:**
    ```javascript
    import { InputMulti } from "./input-multi.js";
    ```

2.  **Add the element to your HTML:**
    ```html
    <input-multi id="phone-numbers" type="telephone" maxlength="3"></input-multi>
    ```

3.  **Get or set its value (an array) via JavaScript:**
    ```javascript
    const phoneNumbers = document.getElementById("phone-numbers");

    // Get values as an array
    console.log(phoneNumbers.value); // e.g., ["090-1111-2222", "090-3333-4444"]

    // Set values from an array
    phoneNumbers.value = ["080-5555-6666"];
    ```

## Vocabulary CSV Definition

The `<input-form>` component is configured via a CSV file. This file defines each field in the form using the following columns:

| Column        | Description                                                                                                                            |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `name_ja`     | The field label displayed in the UI. Also used as the key in the `value` object.                                                       |
| `mandatory`   | Set to `1` if the field is required, `0` otherwise.                                                                                    |
| `type`        | The data type and input control to use. See **Field Types** below.                                                                     |
| `description` | A description of the field (reserved for future use).                                                                                  |
| `url`         | A URL associated with the field (reserved for future use).                                                                             |
|
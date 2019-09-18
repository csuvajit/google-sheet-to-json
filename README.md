### Google Spreadsheet to JSON

### Usage

First, you must publish your spreadsheet to the web, using `File > Publish To Web` in your Google Spreadsheet.

```js
const { Sheet } = require('gsx-json');

const sheet = new Sheet({
    id: '1hY2zD8b0uK7fGEhZMMzUsfDNyKYud3MYae3d2jEQihM',
    sheet: 1,
    query: '',
    int: true,
    rows: true,
    columns: true
});

const data = sheet.json();
```

This will update live with changes to the [spreadsheet](https://docs.google.com/spreadsheets/d/1hY2zD8b0uK7fGEhZMMzUsfDNyKYud3MYae3d2jEQihM/edit?usp=sharing).

### Parameters `.json({ })`

**`id` (required):** ID of the document. (<b>Not required</b> if passed to the constructor)<br>
This is the big long aplha-numeric code in the middle of your document URL.

**`sheet` (optional - deafult: 1):** The number of the individual sheet you want to get data from.<br>
First sheet is 1, second sheet is 2, etc. If no sheet is entered then 1 is the default.

**`query` (optional):** A simple query string.<br>
This is case insensitive and will add any row containing the string in any cell to the filtered result.

**`int` (optional - default: true):** Setting `integers` to false will return numbers as a string.

**`rows` (optional - default: true):** Setting `rows` to false will return only column data.

**`columns` (optional - default: true):** Setting `columns` to false will return only row data.

### Example Response

There are two sections to the returned data - Columns (containing the names of each column), and Rows (containing each row of data as an object.

```json
{
    "columns": {
        "name": ["Tulip", "Daffodil", "Poppy", "Sunflower"],
        "price": [10, 12, 15, 8],
        "rating": [6, 4, 5, 7]
    },
    "rows": [
        {
            "name": "Tulip",
            "price": 10,
            "rating": 6
        },
        {
            "name": "Daffodil",
            "price": 12,
            "rating": 4
        },
        {
            "name": "Poppy",
            "price": 15,
            "rating": 5
        },
        {
            "name": "Sunflower",
            "price": 8,
            "rating": 7
        }
    ]
}
```

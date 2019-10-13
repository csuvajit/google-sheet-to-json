const fetch = require('node-fetch');

class Sheet {
	constructor(option) {
		this.id = option.id;
		this.sheet = option.sheet || 1;
		this.query = option.query || '';
		this.useInt = option.int || true;
		this.showRows = option.rows || true;
		this.showColumns = option.columns || true;
	}

	async json({
		id = this.id,
		sheet = this.sheet,
		columns = this.showColumns,
		rows = this.showRows,
		int = this.useInt,
		query = this.query
	} = {}) {
		return this._get({
			id,
			sheet,
			showColumns: columns,
			showRows: rows,
			useInt: int,
			query
		});
	}

	async _get({ id, sheet, showColumns, showRows, useInt, query } = {}) {
		const res = await fetch(`https://spreadsheets.google.com/feeds/list/${id}/${sheet}/public/values?alt=json`);
		if (!res.ok) throw new Error('Invalid sheet ID or document is not published.');

		const data = await res.json().catch(() => null);
		if (!data) throw new Error('Invalid sheet ID or document is not published.');

		const Obj = {};
		const rows = [];
		const columns = {};

		for (const entry of data.feed.entry.values()) {
			const keys = Object.keys(entry);
			const newRow = {};
			let queried = false;

			for (const key of keys.values()) {
				const gsx = key.indexOf('gsx$');
				if (gsx > -1) {
					const name = key.substring(4);
					const content = entry[key];
					let value = content.$t;

					if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
						queried = true;
					}

					if (useInt === true && !isNaN(value)) {
						value = Number(value);
					}

					newRow[name] = value;
					if (queried === true) {
						// eslint-disable-next-line no-negated-condition
						if (!columns.hasOwnProperty(name)) {
							columns[name] = [];
							columns[name].push(value);
						} else {
							columns[name].push(value);
						}
					}
				}
			}

			if (queried === true) {
				rows.push(newRow);
			}
		}

		if (showColumns === true) {
			Obj.columns = columns;
		}

		if (showRows === true) {
			Obj.rows = rows;
		}

		return Obj;
	}
}

module.exports = Sheet;

const fetch = require('node-fetch');

class Gsx {
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

		let Obj = {};
		let rows = [];
		let columns = {};

		for (const entry of data.feed.entry.values()) {
			let keys = Object.keys(entry);
			let newRow = {};
			let queried = false;

			for (const key of keys.values()) {
				let gsx = key.indexOf('gsx$');
				if (gsx > -1) {
					let name = key.substring(4);
					let content = entry[key];
					let value = content.$t;

					if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
						queried = true;
					}

					if (useInt === true && !isNaN(value)) {
						value = Number(value);
					}

					newRow[name] = value;
					if (queried === true) {
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

module.exports = Gsx;

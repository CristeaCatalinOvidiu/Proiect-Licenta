import { regex, omit } from "./limits.js";

export default class FormatPage {
	constructor(ARR, comand) {
		this.ARR = ARR;
		this.comand = comand;
	}
	search_by_method() {
		const queryObj = JSON.parse(JSON.stringify(this.comand));

		const excludedFields = ["page", "sort", "limit"];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => `$${match}`);

		this.ARR.find(JSON.parse(queryStr));

		return this;
	}

	sort_by_method() {
		const sorting = this.comand.sort;

		if (!sorting) {
			this.ARR = this.ARR.sort("-createdAt");
		} else if (sorting) {
			const sortBy = this.comand.sort.split(",").join(" ");
			this.ARR = this.ARR.sort(sortBy);
		}

		return this;
	}

	refresh_page() {
		return this;
	}

	iterate_by_method() {
		const page = this.comand.page * 1 || 1;
		const limit = this.comand.limit * 1 || 9;
		const skip = (page - 1) * limit;
		this.ARR = this.ARR.skip(skip).limit(limit);
		return this;
	}
}

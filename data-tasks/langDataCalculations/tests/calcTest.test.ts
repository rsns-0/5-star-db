import type { Prisma } from "@prisma/client";
import { RatioAlgorithm } from "../ratioAlgorithm";

import { expect, it } from "vitest";
import { cleanupCountryNames } from "../../lib/cleanupCountryNames";

const data = {
	id: 152441,
	left_country_table: "rest_countries_api_data_names",
	left_country_table_field_name: "official",
	left_country_id: 176,
	left_country_name: "Republic of Panama",
	right_country_table: "newCiaLanguageData",
	right_country_table_field_name: "country",
	right_country_id: 771,
	right_country_name: "Central African Republic",
	ratio: 38,
	token_set_ratio: 62,
};

function calculate({ left_country_name, right_country_name }: Prisma.CalculationCreateInput) {
	left_country_name = cleanupCountryNames(left_country_name);
	right_country_name = cleanupCountryNames(right_country_name);
	const alg = new RatioAlgorithm();
	const res = alg.calculate(left_country_name, right_country_name);

	return res;
}

it("should have lower score after cleaning text", () => {
	const input = { ...data };
	const res = calculate(input);
	expect(res.ratio).toBeLessThan(data.ratio);
	expect(res.tokenSetRatio).toBeLessThan(data.ratio);
});

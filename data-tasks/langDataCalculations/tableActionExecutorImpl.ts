import { tables } from "./constants";
import { TableActionExecutor } from "./tableActionExecutor";

export class TableActionExecutorImpl extends TableActionExecutor {
	run(): void {
		const { cia, rest, wiki } = this.data;
		this.runCoreAction({
			leftTable: tables.newCiaLanguageData,
			rightTable: tables.wikiData,
			leftTableData: cia,
			rightTableData: wiki,
			leftFieldName: "country",
			rightFieldName: "country_or_region",
		});
		this.runCoreAction({
			leftTable: tables.rest_countries_api_data_names,
			rightTable: tables.newCiaLanguageData,
			leftTableData: rest,
			rightTableData: cia,
			leftFieldName: "common",
			rightFieldName: "country",
		});
		this.runCoreAction({
			leftTable: tables.rest_countries_api_data_names,
			rightTable: tables.newCiaLanguageData,
			leftTableData: rest,
			rightTableData: cia,
			leftFieldName: "official",
			rightFieldName: "country",
		});
		this.runCoreAction({
			leftTable: tables.rest_countries_api_data_names,
			rightTable: tables.wikiData,
			leftTableData: rest,
			rightTableData: wiki,
			leftFieldName: "common",
			rightFieldName: "country_or_region",
		});
		this.runCoreAction({
			leftTable: tables.rest_countries_api_data_names,
			rightTable: tables.wikiData,
			leftTableData: rest,
			rightTableData: wiki,
			leftFieldName: "official",
			rightFieldName: "country_or_region",
		});
	}
}

import type {
	QueryReturn,
	ExecuteArgs,
	ExecuteArgsSingle,
	StringKeyOf,
	TableData,
	Validator,
} from "../types";
import { tables } from "./constants";
import { DataTracker } from "./dataTracker";
import { defaultValidator } from "./validator";
import { RatioAlgorithmToTableAdapter } from "./ratioAlgorithm";

export abstract class CoreAction {
	abstract execute<
		TData extends TableData & Record<TDataKey, string>,
		TData2 extends TableData & Record<TData2Key, string>,
		TDataKey extends StringKeyOf<TData>,
		TData2Key extends StringKeyOf<TData2>,
		TLeftTable extends StringKeyOf<typeof tables>,
		TRightTable extends StringKeyOf<typeof tables>
	>({
		leftFieldName,
		leftTable,
		leftTableData,
		rightFieldName,
		rightTable,
		rightTableData,
	}: ExecuteArgsSingle<TData, TData2, TDataKey, TData2Key, TLeftTable, TRightTable>): void;
}

export abstract class TableActionExecutor {
	constructor(
		public data: QueryReturn,
		public dataTracker = new DataTracker(),
		public coreAction: CoreAction = new RatioAlgorithmToTableAdapter(),
		public validator: Validator = defaultValidator
	) {}

	abstract run(): void;

	protected runCoreAction<
		TData extends TableData & Record<TDataKey, string>,
		TData2 extends TableData & Record<TData2Key, string>,
		TDataKey extends StringKeyOf<TData>,
		TData2Key extends StringKeyOf<TData2>,
		TLeftTable extends StringKeyOf<typeof tables>,
		TRightTable extends StringKeyOf<typeof tables>
	>({
		leftTable,
		rightTable,
		leftFieldName,
		rightFieldName,
		leftTableData,
		rightTableData,
	}: ExecuteArgs<TData, TData2, TDataKey, TData2Key, TLeftTable, TRightTable>) {
		this.validator({
			leftFieldName,
			rightFieldName,
			leftTableData,
			rightTableData,
			leftTable,
			rightTable,
		});
		leftTableData.forEach((leftTableData) => {
			rightTableData.forEach((rightTableData) => {
				this.coreAction.execute({
					leftFieldName,
					leftTable,
					leftTableData,
					rightFieldName,
					rightTable,
					rightTableData,
				});
			});
		});
	}
}

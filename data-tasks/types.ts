import type { QueryService } from "./langDataCalculations/query";
import type { tables } from "./langDataCalculations/constants";
import type { CoreAction } from "./langDataCalculations/tableActionExecutor";

export type QueryReturn = Awaited<ReturnType<QueryService["query"]>>;

export type ClassMethod<
	TClass extends object,
	TMethod extends keyof TClass
> = TClass[TMethod] extends (...args: any[]) => any ? TClass[TMethod] : never;

export type ClassMethodReturn<TClass extends object, TMethod extends keyof TClass> = ClassMethod<
	TClass,
	TMethod
> extends (...args: any[]) => infer R
	? R
	: never;

export type AnyFunction = (...args: any[]) => any;

export type LogStrategy<TReturn> = TReturn extends Promise<unknown>
	? (result: Awaited<TReturn>) => void
	: ((result: TReturn) => void) | string | undefined;
export type TableData = { id: number };

export type StringKeyOf<T> = Extract<keyof T, string>;

type BaseExecuteArgs<
	TData extends TableData & Record<TDataKey, string>,
	TData2 extends TableData & Record<TData2Key, string>,
	TDataKey extends StringKeyOf<TData>,
	TData2Key extends StringKeyOf<TData2>,
	TLeftTable extends StringKeyOf<typeof tables>,
	TRightTable extends StringKeyOf<typeof tables>
> = {
	leftTable: TLeftTable;
	rightTable: TRightTable;
	leftFieldName: TDataKey;
	rightFieldName: TData2Key;
};

type _TData = TableData & Record<string, string>;
type _TData2 = TableData & Record<string, string>;
type _TDataKey<TData> = StringKeyOf<TData>;
type _TData2Key<TData2> = StringKeyOf<TData2>;
type _TLeftTable = StringKeyOf<typeof tables>;
type _TRightTable = StringKeyOf<typeof tables>;

export type ExecuteArgs<
	TData extends _TData,
	TData2 extends _TData2,
	TDataKey extends _TDataKey<TData>,
	TData2Key extends _TData2Key<TData2>,
	TLeftTable extends _TLeftTable,
	TRightTable extends _TRightTable
> = BaseExecuteArgs<TData, TData2, TDataKey, TData2Key, TLeftTable, TRightTable> & {
	leftTableData: TData[];
	rightTableData: TData2[];
};

export type ExecuteArgsSingle<
	TData extends _TData,
	TData2 extends _TData2,
	TDataKey extends _TDataKey<TData>,
	TData2Key extends _TData2Key<TData2>,
	TLeftTable extends _TLeftTable,
	TRightTable extends _TRightTable
> = BaseExecuteArgs<TData, TData2, TDataKey, TData2Key, TLeftTable, TRightTable> & {
	leftTableData: TData;
	rightTableData: TData2;
};
export type ValidatorArgs = {
	leftFieldName: string;
	rightFieldName: string;
	leftTableData: Record<string, any>[];
	rightTableData: Record<string, any>[];
	leftTable: string;
	rightTable: string;
};

export type Validator = (args: ValidatorArgs) => void;

export type CoreActionArgs = Parameters<CoreAction["execute"]>[0];
export type Calculation = {
	identifier: {
		leftId: number;
		rightId: number;
		leftTable: keyof typeof tables;
		rightTable: keyof typeof tables;
		leftFieldName: string;
		rightFieldName: string;
	};
	calculations: {
		ratio: number;
		tokenSetRatio: number;
	};
	leftValue: string;
	rightValue: string;
};

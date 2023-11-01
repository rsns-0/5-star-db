import type { LogStrategy } from "./types";

function handleLogStrategy<TResult extends Awaited<any>>(
	logStrategy: LogStrategy<TResult>,
	result: TResult
) {
	if (!logStrategy) {
		console.log(result);
		return;
	}
	typeof logStrategy === "string" ? console.log(logStrategy) : console.log(logStrategy(result));
}

export function log<TReturn>(logStrategy: LogStrategy<TReturn>) {
	return function (_: any, __: any, descriptor: PropertyDescriptor) {
		const targetMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const result: TReturn = targetMethod.apply(this, args);
			handleLogStrategy(logStrategy, result);

			return result;
		};
	};
}

export function asyncLog<TReturn>(logStrategy: LogStrategy<TReturn>) {
	return function (_: any, __: any, descriptor: PropertyDescriptor) {
		const targetMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const result: Awaited<TReturn> = await targetMethod.apply(this, args);
			handleLogStrategy(logStrategy, result);
			return result;
		};
	};
}

export function getValueForFirstKeyOfObject<T>(obj: Record<string, T>) {
	const index = Object.keys(obj)[0];
	if (!index) {
		return;
	}
	return obj[index];
}

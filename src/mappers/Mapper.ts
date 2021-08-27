export type From<T1, T2> = T1 & T2;

export abstract class Mapper<From, Result> {
	public abstract to(data: From[] | From, params?: any): Result[] | Result;
}

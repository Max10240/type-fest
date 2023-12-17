import type {Primitive} from './primitive';
import type {Simplify} from './simplify';
import type {Trim} from './trim';
import type {IsAny} from './is-any';
import type {IsEqual} from './is-equal';
import type {IsNegative, NegativeInfinity, PositiveInfinity, Subtract} from './numeric';
import type {UnknownRecord} from './unknown-record';
import type {UnknownArray} from './unknown-array';

// TODO: Remove for v5.
export type {UnknownRecord} from './unknown-record';

/**
Infer the length of the given array `<T>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type TupleLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

/**
Create a tuple type of the given length `<L>` and fill it with the given type `<Fill>`.

If `<Fill>` is not provided, it will default to `unknown`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
export type BuildTuple<L extends number, Fill = unknown, T extends readonly unknown[] = []> = T['length'] extends L
	? T
	: BuildTuple<L, Fill, [...T, Fill]>;

/**
Create an object type with the given key `<Key>` and value `<Value>`.

It will copy the prefix and optional status of the same key from the given object `CopiedFrom` into the result.

@example
```
type A = BuildObject<'a', string>;
//=> {a: string}

// Copy `readonly` and `?` from the key `a` of `{readonly a?: any}`
type B = BuildObject<'a', string, {readonly a?: any}>;
//=> {readonly a?: string}
```
*/
export type BuildObject<Key extends PropertyKey, Value, CopiedFrom extends object = {}> =
	Key extends keyof CopiedFrom
		? Pick<{[_ in keyof CopiedFrom]: Value}, Key>
		: Key extends `${infer NumberKey extends number}`
			? NumberKey extends keyof CopiedFrom
				? Pick<{[_ in keyof CopiedFrom]: Value}, NumberKey>
				: {[_ in Key]: Value}
			: {[_ in Key]: Value};

/**
Return a string representation of the given string or number.

Note: This type is not the return type of the `.toString()` function.
*/
export type ToString<T> = T extends string | number ? `${T}` : never;

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

/**
Matches non-recursive types.
*/
export type NonRecursiveType = BuiltIns | Function | (new (...args: any[]) => unknown);

/**
Returns a boolean for whether the given type is a plain key-value object.
*/
export type IsPlainObject<T> =
	T extends NonRecursiveType | UnknownArray | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
		? false
		: T extends object
			? true
			: false;

/**
Converts a numeric string to a number.

@example
```
type PositiveInt = StringToNumber<'1234'>; // => 1234;
type NegativeInt = StringToNumber<'-1234'>; // => -1234;
type PositiveFloat = StringToNumber<'1234.56'>; // => 1234.56;
type NegativeFloat = StringToNumber<'-1234.56'>; // => -1234.56;
type PositiveInfinity = StringToNumber<'Infinity'>; // => Infinity
type NegativeInfinity = StringToNumber<'-Infinity'>; // => -Infinity
```

@category String
@category Numeric
@category Template literal
*/
export type StringToNumber<S extends string> = S extends `${infer N extends number}`
	? N
	: S extends 'Infinity'
		? PositiveInfinity
		: S extends '-Infinity'
			? NegativeInfinity
			: never;

/**
Returns a boolean for whether the given string `S` starts with the given string `SearchString`

@example
```
StartsWith<'abcde', 'abc'>
//=> true

StartsWith<'abcde', 'bc'>
//=> false

StartsWith<string, 'bc'>
//=> boolean

StartsWith<'abcde', string>
//=> boolean
```

@category String
@category Template literal
*/
export type StartsWith<S extends string, SearchString extends string> = string extends S | SearchString
	? boolean
	: S extends `${SearchString}${infer T}`
		? true
		: false;

/**
Returns the length of the given string.

@example
```
StringLength<'abcde'>
//=> 5

StringLength<string>
//=> number
```

@category String
@category Template literal
*/
export type StringLength<S extends string> = StringToArray<S>['length'];

/**
Returns an array of the characters of the string.

@example
```
StringToArray<'abcde'>
//=> ['a', 'b', 'c', 'd', 'e']

StringToArray<string>
//=> string[]
```

@category String
*/
export type StringToArray<S extends string, Result extends string[] = []> = string extends S
	? string[]
	: S extends `${infer F}${infer R}`
		? StringToArray<R, [...Result, F]>
		: Result;

export type UpperCaseCharacters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type StringDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Whitespace =
	| '\u{9}' // '\t'
	| '\u{A}' // '\n'
	| '\u{B}' // '\v'
	| '\u{C}' // '\f'
	| '\u{D}' // '\r'
	| '\u{20}' // ' '
	| '\u{85}'
	| '\u{A0}'
	| '\u{1680}'
	| '\u{2000}'
	| '\u{2001}'
	| '\u{2002}'
	| '\u{2003}'
	| '\u{2004}'
	| '\u{2005}'
	| '\u{2006}'
	| '\u{2007}'
	| '\u{2008}'
	| '\u{2009}'
	| '\u{200A}'
	| '\u{2028}'
	| '\u{2029}'
	| '\u{202F}'
	| '\u{205F}'
	| '\u{3000}'
	| '\u{FEFF}';

export type WordSeparators = '-' | '_' | Whitespace;

/**
Matches any unknown array or tuple.
*/
export type UnknownArrayOrTuple = readonly [...unknown[]];

/**
Matches any non empty tuple.
*/
export type NonEmptyTuple = readonly [unknown, ...unknown[]];

/**
Returns a boolean for whether the two given types extends the base type.
*/
export type IsBothExtends<BaseType, FirstType, SecondType> = FirstType extends BaseType
	? SecondType extends BaseType
		? true
		: false
	: false;

/**
Extracts the type of the first element of an array or tuple.
*/
export type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: never;

/**
Extracts the type of an array or tuple minus the first element.
*/
export type ArrayTail<TArray extends UnknownArrayOrTuple> = TArray extends readonly [unknown, ...infer TTail] ? TTail : [];

/**
Extract the element of an array that also works for array union.

Returns `never` if T is not an array.

It creates a type-safe way to access the element type of `unknown` type.
*/
export type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;

/**
Extract the object field type if T is an object and K is a key of T, return `never` otherwise.

It creates a type-safe way to access the member type of `unknown` type.
*/
export type ObjectValue<T, K> =
	K extends keyof T
		? T[K]
		: ToString<K> extends keyof T
			? T[ToString<K>]
			: K extends `${infer NumberK extends number}`
				? NumberK extends keyof T
					? T[NumberK]
					: never
				: never;

/**
Returns a boolean for whether the string is lowercased.
*/
export type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;

/**
Returns a boolean for whether the string is uppercased.
*/
export type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

/**
Returns a boolean for whether a string is whitespace.
*/
export type IsWhitespace<T extends string> = T extends Whitespace
	? true
	: T extends `${Whitespace}${infer Rest}`
		? IsWhitespace<Rest>
		: false;

/**
Returns a boolean for whether the string is numeric.

This type is a workaround for [Microsoft/TypeScript#46109](https://github.com/microsoft/TypeScript/issues/46109#issuecomment-930307987).
*/
export type IsNumeric<T extends string> = T extends `${number}`
	? Trim<T> extends T
		? true
		: false
	: false;

/**
For an object T, if it has any properties that are a union with `undefined`, make those into optional properties instead.

@example
```
type User = {
	firstName: string;
	lastName: string | undefined;
};

type OptionalizedUser = UndefinedToOptional<User>;
//=> {
// 	firstName: string;
// 	lastName?: string;
// }
```
*/
export type UndefinedToOptional<T extends object> = Simplify<
{
	// Property is not a union with `undefined`, keep it as-is.
	[Key in keyof Pick<T, FilterDefinedKeys<T>>]: T[Key];
} & {
	// Property _is_ a union with defined value. Set as optional (via `?`) and remove `undefined` from the union.
	[Key in keyof Pick<T, FilterOptionalKeys<T>>]?: Exclude<T[Key], undefined>;
}
>;

// Returns `never` if the key or property is not jsonable without testing whether the property is required or optional otherwise return the key.
type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol
	? never
	: Type[Key] extends symbol
		? never
		/*
		To prevent a problem where an object with only a `name` property is incorrectly treated as assignable to a function, we first check if the property is a record.
		This check is necessary, because without it, if we don't verify whether the property is a record, an object with a type of `{name: any}` would return `never` due to its potential assignability to a function.
		See: https://github.com/sindresorhus/type-fest/issues/657
		*/
		: Type[Key] extends Record<string, unknown>
			? Key
			: [(...arguments_: any[]) => any] extends [Type[Key]]
				? never
				: Key;

/**
Returns the required keys.
*/
type FilterDefinedKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? Key
		: undefined extends T[Key]
			? never
			: T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>;
}[keyof T],
undefined
>;

/**
Returns the optional keys.
*/
type FilterOptionalKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? never
		: undefined extends T[Key]
			? T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>
			: never;
}[keyof T],
undefined
>;

/**
Test if the given function has multiple call signatures.

Needed to handle the case of a single call signature with properties.

Multiple call signatures cannot currently be supported due to a TypeScript limitation.
@see https://github.com/microsoft/TypeScript/issues/29732
*/
export type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: any[]): unknown}
		? unknown[] extends A
			? false
			: true
		: false;

/**
Returns a boolean for whether the given `boolean` is not `false`.
*/
export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;

/**
Returns a boolean for whether the given type is `null`.
*/
export type IsNull<T> = [T] extends [null] ? true : false;

/**
Disallows any of the given keys.
*/
export type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;

/**
Returns a boolean for whether the given type is primitive value or primitive type.

@example
```
IsPrimitive<'string'>
//=> true

IsPrimitive<string>
//=> true

IsPrimitive<Object>
//=> false
```
*/
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;

/**
Returns a boolean for whether A and B are both true.

@example
```
And<true, true>
//=> true

And<true, false>
//=> false
```
*/
export type And<A extends boolean, B extends boolean> = [A, B][number] extends true
	? true
	: true extends [IsEqual<A, false>, IsEqual<B, false>][number]
		? false
		: boolean;

/**
Returns a boolean for either A or B is true.

@example
```
Or<true, false>
//=> true

Or<false, false>
//=> false
```
*/
export type Or<A extends boolean, B extends boolean> = [A, B][number] extends false
	? false
	: true extends [IsEqual<A, true>, IsEqual<B, true>][number]
		? true
		: boolean;

/**
Returns a boolean for whether A is false.

@example
```
Not<true>
//=> false

Not<false>
//=> true
```
*/
export type Not<A extends boolean> = A extends true
	? false
	: A extends false
		? true
		: boolean;

/**
Returns the maximum value from a tuple of integers.

Note:
- float number is not supported.

@example
```
ArrayMax<[1, 2, 5, 3]>;
//=> 5

ArrayMax<[1, 2, 5, 3, 99, -1]>
//=> 99
```
*/
export type ArrayMax<A extends number[], Result extends number = NegativeInfinity> = A extends [infer F extends number, ...infer R extends number[]]
	? Gt<F, Result> extends true
		? ArrayMax<R, F>
		: ArrayMax<R, Result>
	: Result;

/**
Returns the minimal value from a tuple of integers.

@example
```
ArrayMin<[1, 2, 5, 3]>
//=> 1

ArrayMin<[1, 2, 5, 3, -5]>
//=> -5
```
*/
export type ArrayMin<A extends number[], Result extends number = PositiveInfinity> = A extends [infer F extends number, ...infer R extends number[]]
	? Lt<F, Result> extends true
		? ArrayMin<R, F>
		: ArrayMin<R, Result>
	: Result;

/**
Returns the absolute value of a given value.

@example
```
NumberAbsolute<-1>
//=> 1

NumberAbsolute<1>
//=> 1

NumberAbsolute<NegativeInfinity>
//=> PositiveInfinity
```
*/
export type NumberAbsolute<N extends number> = `${N}` extends `-${infer StringPositiveN}` ? StringToNumber<StringPositiveN> : N;

/**
Returns a boolean for whether A > B.

@example
```
Gt<1, -5>
//=> true

Gt<1, 1>
//=> false

Gt<1, 5>
//=> false
```
*/
export type Gt<A extends number, B extends number> = number extends A | B
	? boolean
	: [
		IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
		IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
	] extends infer R extends [boolean, boolean, boolean, boolean]
		? Or<
		And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
		And<IsEqual<R[3], true>, IsEqual<R[1], false>>
		> extends true
			? true
			: Or<
			And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
			And<IsEqual<R[2], true>, IsEqual<R[0], false>>
			> extends true
				? false
				: true extends R[number]
					? false
					: [IsNegative<A>, IsNegative<B>] extends infer R extends [boolean, boolean]
						? [true, false] extends R
							? false
							: [false, true] extends R
								? true
								: [false, false] extends R
									? PositiveNumericStringGt<`${A}`, `${B}`>
									: PositiveNumericStringGt<`${NumberAbsolute<B>}`, `${NumberAbsolute<A>}`>
						: never
		: never;

/**
Returns a boolean for whether A >= B.

@example
```
Gte<1, -5>
//=> true

Gte<1, 1>
//=> true

Gte<1, 5>
//=> false
```
*/
export type Gte<A extends number, B extends number> = number extends A | B
	? boolean
	: A extends B ? true : Gt<A, B>;

/**
Returns a boolean for whether A < B.

@example
```
Lt<1, -5>
//=> false

Lt<1, 1>
//=> false

Lt<1, 5>
//=> true
```
*/

export type Lt<A extends number, B extends number> = number extends A | B
	? boolean
	: Gte<A, B> extends true ? false : true;

/**
Returns a boolean for whether A <= B.

@example
```
Lte<1, -5>
//=> false

Lte<1, 1>
//=> true

Lte<1, 5>
//=> true
```
*/
export type Lte<A extends number, B extends number> = number extends A | B
	? boolean
	: Gt<A, B> extends true ? false : true;

/**
Returns a boolean for whether A > B(A and B are both numeric string and have the same length).

@example
```
SameLengthPositiveNumericStringGt<'50', '10'>
//=> true

SameLengthPositiveNumericStringGt<'10', '10'>
//=> false
```
*/
type SameLengthPositiveNumericStringGt<A extends string, B extends string> = A extends `${infer FirstA}${infer RestA}`
	? B extends `${infer FirstB}${infer RestB}`
		? FirstA extends FirstB
			? SameLengthPositiveNumericStringGt<RestA, RestB>
			: PositiveNumericCharGt<FirstA, FirstB>
		: never
	: false;

type NumericString = '0123456789';

/**
Returns a boolean for whether A > B(A and B are both positive numeric string).

@example
```
PositiveNumericStringGt<'500', '1'>
//=> true

PositiveNumericStringGt<'1', '1'>
//=> false

PositiveNumericStringGt<'1', '500'>
//=> false
```
*/
type PositiveNumericStringGt<A extends string, B extends string> = A extends B
	? false
	: [BuildTuple<StringLength<A>, 0>, BuildTuple<StringLength<B>, 0>] extends infer R extends [readonly unknown[], readonly unknown[]]
		? R[0] extends [...R[1], ...infer Remain extends readonly unknown[]]
			? 0 extends Remain['length']
				? SameLengthPositiveNumericStringGt<A, B>
				: true
			: false
		: never;

/**
Returns a boolean for whether A > B(A and B are both positive numeric char).

@example
```
PositiveNumericCharGt<'5', '1'>
//=> true

PositiveNumericCharGt<'1', '1'>
//=> false
```
*/
type PositiveNumericCharGt<A extends string, B extends string> = NumericString extends `${infer HeadA}${A}${infer TailA}`
	? NumericString extends `${infer HeadB}${B}${infer TailB}`
		? HeadA extends `${HeadB}${infer _}${infer __}`
			? true
			: false
		: never
	: never;

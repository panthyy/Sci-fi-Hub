export type ExclusiveVariant<T, U> =
  | (T & { [K in keyof U]?: never })
  | (U & { [K in keyof T]?: never });

export type ExclusiveVariants<T extends any[]> = T extends [
  infer A,
  infer B,
  ...infer Rest
]
  ? ExclusiveVariant<A, ExclusiveVariants<[B, ...Rest]>>
  : T extends [infer A]
  ? A
  : never;

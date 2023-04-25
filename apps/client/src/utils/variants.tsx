import { SerializedStyles } from "@emotion/react";
export const Variants = (
  booleans: {
    [key: string]: any;
  },
  variants: Map<string, SerializedStyles>
) => {
  const variantKeys = Object.keys(booleans).filter(
    (key) => typeof booleans[key] === "boolean" && booleans[key]
  );
  console;
  let arr = [];

  for (const [key, value] of variants.entries()) {
    if (variantKeys.includes(key) || key === "base") {
      arr.push(value);
    }
  }
  return arr;
};

export type Variants<T> = Map<keyof (T & { base: boolean }), SerializedStyles>;

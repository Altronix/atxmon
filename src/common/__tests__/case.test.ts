import { toSnakeCase } from "../case";

interface Expect {
  snake_bad0: string;
  snake_bad1: string;
  number_bad0: number;
  number_bad1: number;
  bool_bad0: boolean;
  bool_bad1: boolean;
  num0: number;
  num1: number;
  str0: string;
  str1: string;
  bool0: boolean;
  bool1: boolean;
  fooUndefined: undefined;
  fooObject: object;
}

test("toSnakeCase should transform", () => {
  const val = {
    snakeBad0: "2.0.10",
    snakeBad1: "2.0.11",
    numberBad0: 440,
    numberBad1: 441,
    boolBad0: false,
    boolBad1: true,
    num0: 440,
    num1: 441,
    str0: "str0",
    str1: "str1",
    bool0: false,
    bool1: true,
    fooUndefined: undefined,
    fooObject: { foo: "bar" }
  };
  let ret = toSnakeCase<Expect>(val);
  expect(ret.snake_bad0).toBe(val.snakeBad0);
  expect(ret.snake_bad1).toBe(val.snakeBad1);
  expect(ret.number_bad0).toBe(val.numberBad0);
  expect(ret.number_bad1).toBe(val.numberBad1);
  expect(ret.bool_bad0).toBe(val.boolBad0);
  expect(ret.bool_bad1).toBe(val.boolBad1);
  expect(ret.num0).toBe(val.num0);
  expect(ret.num1).toBe(val.num1);
  expect(ret.str0).toBe(val.str0);
  expect(ret.str1).toBe(val.str1);
  expect(ret.bool0).toBe(val.bool0);
  expect(ret.bool1).toBe(val.bool1);
  expect(ret.fooUndefined).toBe(val.fooUndefined);
  expect(ret.fooObject).toEqual(val.fooObject);
});

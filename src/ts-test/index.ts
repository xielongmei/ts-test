// 1、动态的类型推断,T 只能是对象
interface Obj {
  name: string;
}
// 这里是限制为只能是对象
function iSay<T extends Record<string, any>>(arg: T[]): T {
  console.log(arg.length);
  return arg[0];
}
// 这里是限制在Obj的基础上，没有name属性不行
function iSay<T extends Obj>(arg: T[]): T {
  console.log(arg.length);
  return arg[0];
}

iSay([
  {
    name: "111",
    age: 123,
  },
]);

// 2、infer 关键字
// type ReturnType<T> = T extends (
//   ...args: any[]
//  ) => infer R ? R : T;
// 等价于以下形式：
// type GetRest<T> = T extends infer Rest ? Rest : T;
// 如何让他能获取到除了第一项，之后的数组？

type GetRest<T extends number[]> = T extends [infer start, ...infer Rest]
  ? Rest
  : T;

const arr: GetRest<[1, 2, 3]>; //结果是[2, 3]

// 3、keyof
const getVal = <T extends Record<string, unknown>>(obj: T, key: keyof T) => {
  return obj[key];
};

const obj = {
  name: "kiana",
  age: 100,
};

getVal(obj, "");

//   4、第 3 题进阶, 实现 pick 函数的类型推断，能够自动推断出传入第一个参数 obj 的时候，第二个参数的数组,受到第一个参数的限定，要是字符串数组，并且值只能是一个或多个第一个参数 obj 的 key
const pick = <T extends Record<string, unknown>>(obj: T, arr: (keyof T)[]) => {
  const _obj: any = {};
  for (const key in obj) {
    if (arr.includes(key)) {
      _obj[key] = obj[key];
    }
  }
  return _obj;
};

pick({ a: "1", b: "2" }, ["a"]); //传入的第二个参数是['c']就会报错

// 5、实现 Readonly
interface Todo {
  title: string;
  description: string;
}

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 这个in操作符，其实就是遍历操作
// 后面有些题目，如果对于对象的话，就用这个进行遍历，或者将某个东西转换成对象，进行遍历
// 对象的中括号可以写表达式，这种称为动态key

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};

// 6、元组转换为对象
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type TupleToObject<T extends readonly string[]> = {
  [P in T[number]]: P;
};

// 关键在于T[number]，不知道要用T[number]读取元组的值，并且注意只有只读的数组，才能做到拿到它们的值，如果是普通的数组
type result = TupleToObject<typeof tuple>;

// 7、元组长度
type tesla = ["tesla", "model 3", "model X", "model Y"];
type spaceX = [
  "FALCON 9",
  "FALCON HEAVY",
  "DRAGON",
  "STARSHIP",
  "HUMAN SPACEFLIGHT"
];

type Length<T extends readonly any[]> = T["length"];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5

// 8、第一个元素
type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type First<T extends any[]> = T extends [infer start, ...infer Rest]
  ? start
  : T;

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3

// 9、实现内置的Exclude <T, U>类型，但不能直接使用它本身。
type MyExclude<T, U> = T extends U ? never : T;

// 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型

// 若extends前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给extends后面的类型(是- 一个分发的过程)。
// 第一步，是不是 a 是不是命中a,此时丢掉a，就是利用never丢掉
// 然后第二步，b分配a。不命中，拿T。也就是b
// 第三步，c分配a，不命中，拿T，也就是c

type Result = MyExclude<"a" | "b" | "c", "a">; // 'b' | 'c'

// type P<T> = T extends "x" ? 1 : 2;
// type A3 = P<"x" | "y">;

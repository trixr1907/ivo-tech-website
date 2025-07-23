// Prisma Typen
declare module '@prisma/client' {
  export interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>;
    $use(callback: (params: any, next: (params: any) => Promise<any>) => Promise<any>): void;
  }

  export class Prisma {
    static defineExtension(extension: any): any;
  }
}

// Zod Typen
declare module 'zod' {
  export interface ZodType<T = any, Def extends ZodTypeDef = ZodTypeDef, Input = T> {
    _type: T;
    _def: Def;
    _input: Input;
    _output: T;

    parse(data: unknown): T;
    safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError };
    parseAsync(data: unknown): Promise<T>;
    safeParseAsync(data: unknown): Promise<{ success: boolean; data?: T; error?: ZodError }>;
  }

  export interface ZodTypeDef {
    typeName: ZodFirstPartyTypeKind;
  }

  export type ZodFirstPartyTypeKind =
    | "ZodString"
    | "ZodNumber"
    | "ZodBigInt"
    | "ZodBoolean"
    | "ZodDate"
    | "ZodSymbol"
    | "ZodUndefined"
    | "ZodNull"
    | "ZodAny"
    | "ZodUnknown"
    | "ZodNever"
    | "ZodVoid"
    | "ZodArray"
    | "ZodObject"
    | "ZodUnion"
    | "ZodDiscriminatedUnion"
    | "ZodIntersection"
    | "ZodTuple"
    | "ZodRecord"
    | "ZodMap"
    | "ZodSet"
    | "ZodFunction"
    | "ZodLazy"
    | "ZodLiteral"
    | "ZodEnum"
    | "ZodNativeEnum"
    | "ZodPromise"
    | "ZodEffects"
    | "ZodOptional"
    | "ZodNullable"
    | "ZodDefault"
    | "ZodCatch"
    | "ZodBranded";

  export interface ZodError {
    errors: ZodIssue[];
    addIssue(issue: ZodIssue): void;
    addIssues(issues: ZodIssue[]): void;
  }

  export interface ZodIssue {
    code: ZodIssueCode;
    path: (string | number)[];
    message: string;
    params?: { [k: string]: any };
  }

  export type ZodIssueCode =
    | "invalid_type"
    | "invalid_literal"
    | "custom"
    | "invalid_union"
    | "invalid_union_discriminator"
    | "invalid_enum_value"
    | "unrecognized_keys"
    | "invalid_arguments"
    | "invalid_return_type"
    | "invalid_date"
    | "invalid_string"
    | "too_small"
    | "too_big"
    | "invalid_intersection_types"
    | "not_multiple_of"
    | "not_finite";

  export interface ZodSchema<T = any> extends ZodType<T> {}

  export function z(): {
    string(): ZodType<string>;
    number(): ZodType<number>;
    boolean(): ZodType<boolean>;
    date(): ZodType<Date>;
    undefined(): ZodType<undefined>;
    null(): ZodType<null>;
    any(): ZodType;
    unknown(): ZodType<unknown>;
    never(): ZodType<never>;
    void(): ZodType<void>;
    array<T extends ZodType>(type: T): ZodType<Array<T["_output"]>>;
    object<T extends { [k: string]: ZodType }>(
      shape: T
    ): ZodType<{ [k in keyof T]: T[k]["_output"] }>;
    union<T extends [ZodType, ZodType, ...ZodType[]]>(
      types: T
    ): ZodType<T[number]["_output"]>;
    enum<T extends [string, string, ...string[]]>(values: T): ZodType<T[number]>;
    literal<T extends string | number | boolean | null | undefined>(
      value: T
    ): ZodType<T>;
  };
}

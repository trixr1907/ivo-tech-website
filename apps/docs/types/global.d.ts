/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R> extends Testing.Matchers<R> {}
}

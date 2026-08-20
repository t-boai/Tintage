export interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
}

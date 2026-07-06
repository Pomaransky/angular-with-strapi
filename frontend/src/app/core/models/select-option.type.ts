export interface SelectOption<T extends string | number = string | number> {
  label: string;
  value: T;
}

/* eslint-disable no-unused-vars */
import { TFieldType } from './TFieldType';

export type TFieldValue = {
  value: any;
  label: string;
  fieldType: TFieldType;
  dropdownOnInput?: (event: any, itemKey: string) => Promise<void>;
  onChange?: (value: any) => Promise<void>;
  onBlur?: (event: any) => Promise<void>;
  onScroll?: (event: any) => Promise<void>;
  loading?: boolean;
  maxLength: number;
  options?: any[]
  rules?: any[];
  mask?: string;
  required: boolean;
  isUpperCase: boolean;
  isCapitalize: boolean;
  focus: boolean;
  disabled: boolean;
};

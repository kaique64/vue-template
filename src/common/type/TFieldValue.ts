export type TFieldValue = {
    value: any;
    label: string;
    fieldType: 'select' | 'select:multiple' | 'input' | 'input:number' | 'input:currency' | 'dropdown';
    options?: any[];
    rules?: any[]
};
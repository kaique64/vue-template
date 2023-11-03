/* eslint-disable no-compare-neg-zero */
export function checkNegativeValue(val: any) {
    return (val <= -1 || val == -0);
}
import { date } from "quasar";

export const useDateFormatterService = () => {

  function getDatePatternForDisplay() {
    return "MM/DD/YYYY";
  }

  function getDatePatternBackend() {
    return "YYYY-MM-DD";
  }

  function getDatePatternForDisplayEurope() {
    return "YYYY/MM/DD";
  }

  function formatDateForDisplayEurope(value: Date) {
    return date.formatDate(value, getDatePatternForDisplayEurope());
  }


  function formatDateForDisplay(value: Date) {
    return date.formatDate(value, getDatePatternForDisplayEurope());
  }

  function parseDateFromDisplay(value: string) {
    return date.extractDate(value, getDatePatternForDisplay());
  }

  function parseDate(value: string, pattern: string) {
    return date.extractDate(value, pattern);
  }

  function formatDateBackend(value: Date) {
    return date.formatDate(value, getDatePatternBackend());
  }

  function parseDateFromBackend(value: string) {
    return date.extractDate(value, getDatePatternBackend());
  }

  return {
    getDatePatternForDisplay,
    getDatePatternBackend,
    formatDateForDisplay,
    formatDateForDisplayEurope,
    parseDateFromDisplay,
    parseDate,
    formatDateBackend,
    parseDateFromBackend
  };
};

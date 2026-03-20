import Papa from 'papaparse';
import { COMMON_SUBS } from '@/data/commonSubscriptions';
import { parseCSVRows } from './subscriptionUtils';

/**
 * Parse a CSV bank statement file and return suggested subscriptions
 * Supports: ANZ, CommBank, NAB, Westpac export formats
 * @param {File} file
 * @returns {Promise<{ suggestions: Array, totalRows: number, errors: string[] }>}
 */
export const parseStatementCSV = (file) =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const errors = result.errors.map((e) => e.message);
        const rows   = result.data;

        if (rows.length === 0) {
          resolve({ suggestions: [], totalRows: 0, errors: ['No data rows found in CSV.'] });
          return;
        }

        const suggestions = parseCSVRows(rows, COMMON_SUBS);
        resolve({ suggestions, totalRows: rows.length, errors });
      },
      error: (err) => reject(new Error(err.message)),
    });
  });

/**
 * Normalise debit amounts — bank exports vary in format
 * Some use negative, some use a separate debit column
 */
export const extractAmount = (row) => {
  // Try common column names
  const keys = Object.keys(row).map((k) => k.toLowerCase());

  if (keys.includes('debit')) return Math.abs(parseFloat(row.Debit || row.debit || 0));
  if (keys.includes('amount')) {
    const val = parseFloat(row.Amount || row.amount || 0);
    return Math.abs(val);
  }
  return 0;
};

/**
 * Generate a CSV template for users to fill in manually
 */
export const downloadCSVTemplate = () => {
  const headers = 'Date,Description,Amount\n';
  const example = '01/06/2024,NETFLIX.COM,22.99\n02/06/2024,SPOTIFY AU,12.99\n';
  const blob = new Blob([headers + example], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'bank-statement-template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

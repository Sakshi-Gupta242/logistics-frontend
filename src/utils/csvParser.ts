import Papa from 'papaparse';
import { Delivery } from '../types';

export interface RowValidationError {
  rowNumber: number;
  deliveryId?: string;
  field: string;
  message: string;
}

export interface CSVParseResult {
  deliveries: Delivery[];
  validCount: number;
  invalidCount: number;
  totalDemand: number;
  errors: RowValidationError[];
  headerError?: string;
}

export const sampleCSVContent = `delivery_id,address,demand
DEL-101,"100 N State St, Chicago, IL 60602",15
DEL-102,"800 N Michigan Ave, Chicago, IL 60611",25
DEL-103,"233 S Wacker Dr, Chicago, IL 60606",10
DEL-104,"1410 S Museum Campus Dr, Chicago, IL 60605",30
DEL-105,"1000 W Fulton Market, Chicago, IL 60607",20
DEL-106,"1601 N Clark St, Chicago, IL 60614",18
DEL-107,"3333 S Iron St, Chicago, IL 60608",40
DEL-108,"2001 N Clark St, Chicago, IL 60614",12
DEL-109,"500 W Cermak Rd, Chicago, IL 60616",22
DEL-110,"1200 W Randolph St, Chicago, IL 60607",15
DEL-111,"600 N Ashland Ave, Chicago, IL 60622",35
DEL-112,"2200 N Halsted St, Chicago, IL 60614",28
DEL-113,"1500 S Western Ave, Chicago, IL 60608",16
DEL-114,"3000 N Lincoln Ave, Chicago, IL 60657",42
DEL-115,"400 E 31st St, Chicago, IL 60616",19
DEL-116,"1800 W Division St, Chicago, IL 60622",25
DEL-117,"900 N Wells St, Chicago, IL 60610",14
DEL-118,"2500 S Michigan Ave, Chicago, IL 60616",38
DEL-119,"1100 W Jackson Blvd, Chicago, IL 60607",21
DEL-120,"3500 N Milwaukee Ave, Chicago, IL 60641",27
DEL-121,"700 W Chicago Ave, Chicago, IL 60654",33
DEL-122,"1300 S Canal St, Chicago, IL 60607",17
DEL-123,"2800 N Clybourn Ave, Chicago, IL 60618",24
DEL-124,"450 E Illinois St, Chicago, IL 60611",11
DEL-125,"1700 W Armitage Ave, Chicago, IL 60622",29`;

export function parseAndValidateCSV(fileContent: string): CSVParseResult {
  const parseResult = Papa.parse<Record<string, string>>(fileContent.trim(), {
    header: true,
    skipEmptyLines: 'greedy',
  });

  const errors: RowValidationError[] = [];
  const deliveries: Delivery[] = [];
  const seenDeliveryIds = new Set<string>();

  if (!fileContent.trim()) {
    return {
      deliveries: [],
      validCount: 0,
      invalidCount: 0,
      totalDemand: 0,
      errors: [],
      headerError: 'The CSV file is empty. Please upload a file containing delivery records.',
    };
  }

  const headers = parseResult.meta.fields?.map((h) => h.trim().toLowerCase()) || [];
  const requiredHeaders = ['delivery_id', 'address', 'demand'];

  const missingHeaders = requiredHeaders.filter((req) => !headers.includes(req));
  if (missingHeaders.length > 0) {
    return {
      deliveries: [],
      validCount: 0,
      invalidCount: 0,
      totalDemand: 0,
      errors: [],
      headerError: `Missing required CSV headers: ${missingHeaders.join(', ')}. Header row must include delivery_id, address, demand.`,
    };
  }

  let totalDemand = 0;

  parseResult.data.forEach((row, idx) => {
    const rowNum = idx + 2; // Line 1 is header
    // Normalize keys
    const normalizedRow: Record<string, string> = {};
    Object.keys(row).forEach((key) => {
      normalizedRow[key.trim().toLowerCase()] = row[key]?.trim() || '';
    });

    const rawId = normalizedRow['delivery_id'];
    const rawAddress = normalizedRow['address'];
    const rawDemand = normalizedRow['demand'];

    let rowIsValid = true;

    // Validate delivery_id
    if (!rawId) {
      errors.push({
        rowNumber: rowNum,
        field: 'delivery_id',
        message: 'Missing delivery_id in row.',
      });
      rowIsValid = false;
    } else if (seenDeliveryIds.has(rawId)) {
      errors.push({
        rowNumber: rowNum,
        deliveryId: rawId,
        field: 'delivery_id',
        message: `Duplicate delivery_id '${rawId}' found. ID must be unique.`,
      });
      rowIsValid = false;
    } else {
      seenDeliveryIds.add(rawId);
    }

    // Validate address
    if (!rawAddress) {
      errors.push({
        rowNumber: rowNum,
        deliveryId: rawId || 'N/A',
        field: 'address',
        message: 'Empty address field.',
      });
      rowIsValid = false;
    }

    // Validate demand
    const demandNum = Number(rawDemand);
    if (!rawDemand || isNaN(demandNum)) {
      errors.push({
        rowNumber: rowNum,
        deliveryId: rawId || 'N/A',
        field: 'demand',
        message: `Invalid demand '${rawDemand}'. Demand must be a valid number.`,
      });
      rowIsValid = false;
    } else if (demandNum <= 0) {
      errors.push({
        rowNumber: rowNum,
        deliveryId: rawId || 'N/A',
        field: 'demand',
        message: `Demand must be greater than zero. Received: ${demandNum}`,
      });
      rowIsValid = false;
    }

    if (rowIsValid) {
      totalDemand += demandNum;
      deliveries.push({
        id: `del-${idx + 1}`,
        delivery_id: rawId,
        address: rawAddress,
        demand: demandNum,
        status: 'geocoded',
      });
    }
  });

  return {
    deliveries,
    validCount: deliveries.length,
    invalidCount: errors.length,
    totalDemand,
    errors,
  };
}

export function downloadSampleCSV(): void {
  const blob = new Blob([sampleCSVContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_logistics_deliveries.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

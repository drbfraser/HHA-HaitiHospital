// export interface ReportEntry {
//   key: string,
//   value: number | string | ReportEntry[],

// };

// export interface Report {
//   entries : ReportEntry[],
// }

export interface ReportEntry {
  (x : string) : string | number | boolean | Date | Report | Report[],
}

export interface Report {
  [x : string] :  ReportEntry,
}


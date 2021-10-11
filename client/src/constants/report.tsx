export interface ReportEntry {
  key: string,
  value: number | string | ReportEntry[],
};

export interface Report {
  entries : ReportEntry[],
}

class ReportEntry {
  key: string;
  value: number | string | ReportEntry[];

  constructor(key: string, value: number | string | ReportEntry[]) {
    this.key = key;
    this.value = value;
  }
}

class Report {
  entries : ReportEntry[];

}

export {};
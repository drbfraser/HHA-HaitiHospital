import { timeStamp } from "console";

export interface TickObserver {
  (tickList: TickList): void;
}

export type TickListData = {
  [reportId : string] : boolean;
}

export class TickList {
  private records: TickListData;
  private tickCount: number;
  private observerList: TickObserver[];
  private observerCounter: number;
  private numRecords: number;

  constructor(numRecords: number, data: TickListData) {
    if (Object.keys(data).length > numRecords)
        throw new RangeError("Ticklist() has invalid data passed in");

    this.records = data;
    this.tickCount = 0;
    this.observerList = new Array(0);
    this.observerCounter = 0;
    this.numRecords = numRecords;
  }

  private idxToKey(idx: number): string {
    return Object.keys(this.records)[idx];
  }

  private idxToValue(idx: number): boolean {
    return this.records[this.idxToKey(idx)];
  }

  setTickAtIndex(newValue: boolean, idx: number): TickList{
    let keyOfIdx = this.idxToKey(idx);
    this.records[keyOfIdx] = newValue;
    (newValue === true) ? ++this.tickCount : --this.tickCount;
    this.notifyAllObserver();

    return this;
  }

  setTickAtRid(newValue: boolean, Rid: string): TickList {
    this.records[Rid] = newValue;
    (newValue === true) ? ++this.tickCount : --this.tickCount;
    this.notifyAllObserver();
    return this;
  }

  isAllTicked() : boolean {
    if (this.numRecords === this.tickCount)
      return true;
    else
      return false;
  }

  isNoTicked() : boolean {
    if (this.tickCount === 0)
      return true;
    else 
      return false;
  }

  isTickedIdx(idx: number) : boolean {
    let keyOfIdx = this.idxToKey(idx);
    return this.records[keyOfIdx];
  }

  isTickedRid(Rid: string) : boolean {
    return this.records[Rid];
  }

  tickAll(): void {
    console.log("Ticking all .... \n");

    Object.keys(this.records).forEach((key) => {
      this.records[key] = true;
    })
    this.tickCount = this.numRecords;
    this.notifyAllObserver();
  }

  untickAll(): void {
    console.log("Unticking all .... \n");
    
    Object.keys(this.records).forEach((key) => {
      this.records[key] = false;
    })
    this.tickCount = 0;
    this.notifyAllObserver();
  }

  registerObserver(observer: TickObserver): void {
    this.observerCounter = this.observerList.push(observer);
  }

  unregisterObserver(observerToUnsub: TickObserver) : void {
    this.observerList = this.observerList.filter(observer => observerToUnsub !== observer);
    this.observerCounter = this.observerList.length;
  }

  notifyAllObserver(): void {
    this.observerList.forEach(observer => {
      observer(this);
    });
  }
}

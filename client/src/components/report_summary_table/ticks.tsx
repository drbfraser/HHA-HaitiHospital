export interface TickObserver {
  (tickCount: number): void;
}

export class Ticks {
  private records: boolean[];
  tickCount: number;
  private observerList: TickObserver[];
  private observerCounter: number;

  constructor(numRecords: number) {
    this.records = new Array(numRecords).fill(false);
    this.tickCount = 0;
    this.observerList = new Array(0);
    this.observerCounter = 0;
  }

  setTickAtIndex(newValue: boolean, idx: number): Ticks{
    this.records[idx] = newValue;
    (newValue === true) ? ++this.tickCount : --this.tickCount;
    this.notifyAllObserver();

    return this;
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
      observer(this.tickCount);
    });
  }


}

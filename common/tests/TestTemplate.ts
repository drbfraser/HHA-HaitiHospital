export abstract class TestTemplate {
  private readonly tests: (() => void)[] = [];

  public readonly addTest = (test: () => void): void => {
    this.tests.push(test);
  };

  public readonly addTests = (...tests: (() => void)[]) => {
    tests.forEach((test) => this.tests.push(test));
  };

  public readonly testAll = () => {
    this.tests.forEach((test: () => void) => test());
  };
}

export const recursiveConsumeObjectHOF = (
  consumer: (something: any) => void,
): ((object: any) => void) => {
  return (object: any): void => {
    if (!(object instanceof Object) || object instanceof Function) {
      return;
    }

    Object.entries(object).forEach(([key, value]) => {
      recursiveConsumeObjectHOF(consumer)(value);
    });

    consumer(object);
  };
};

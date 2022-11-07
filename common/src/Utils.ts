export const recursiveConsumeObjectHOF = 
    (consumer: (something: any) => void): 
    (object:any) => void => {
    return (object: any): void => {
        if (!(object instanceof Object) || object instanceof Function) {
            return;
        }
        
        Object.entries(object)
            .forEach(([key, value]) => {
                recursiveConsumeObjectHOF(consumer)(value); 
        });
        
        consumer(object);
    }
}

export function recursiveMapObjectHOF<T>(mapper: (something: any) => T, defaultValue: T): (object:any) => T {
    return (object: any): T => {
        if (!(object instanceof Object) || object instanceof Function) {
            return defaultValue;
        }
        
        Object.entries(object)
            .forEach(([key, value]) => {
                recursiveConsumeObjectHOF(mapper)(value); 
        });
        
        return mapper(object);
    }
}

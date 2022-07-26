type Constructor = { new(): {} };

export class ObjectSerializer {
    private constructorMapper: { [className: string]: Constructor };
    private static objectSerializer: ObjectSerializer;

    private constructor() {
        this.constructorMapper = {};
    }

    public static readonly getObjectSerializer = (): ObjectSerializer => {
        if (!this.objectSerializer) {
            this.objectSerializer = new ObjectSerializer();
        }

        return this.objectSerializer;
    }

    public readonly addSerializable = (constructor: Constructor): void => {
        this.constructorMapper[constructor.name] = constructor;
    }

    public readonly serialize = (object: Object): string => {
        let newObject = Object.create(object);
        Object.assign(newObject, object);
        newObject.__class__ = object.constructor.name;
        return JSON.stringify(newObject);
    }

    public readonly deserialize = <T>(json: string): T => {
        let jsonObject: any = JSON.parse(json);
        let className: string = jsonObject.__class__;
        if (!jsonObject.__class__) {
            throw new Error('No class name specified in JSON');
        }

        delete jsonObject.__class__;
        let returnObject: T = new this.constructorMapper[className]() as T;

        if (!returnObject) {
            throw new Error('Attempting to deserialize un-serializable class');
        }

        Object.assign(returnObject, jsonObject);
        return returnObject;
    }
}

export function serializable(defaultConstructor: Constructor) {
    let objectSerializer = ObjectSerializer.getObjectSerializer();
    objectSerializer.addSerializable(defaultConstructor);
}
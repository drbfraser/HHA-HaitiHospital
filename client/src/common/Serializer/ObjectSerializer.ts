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

    private readonly addClassProperty = (object: Object): Object => {
        if (!this.constructorMapper[object.constructor.name]) {
            return object;
        }

        let newObject = Object.create(object);
        Object.assign(newObject, object);
        newObject.__class__ = object.constructor.name;
        return newObject;
    }

    private readonly recursiveAddClassProperty = (object: any): any => {
        if (!(object instanceof Object) || object instanceof Function) {
            return object;
        }

        Object.entries(object)
            .forEach(([key, value]) => {
                object[key] = this.recursiveAddClassProperty(value);
            });

        let newObject: Object = this.addClassProperty(object);
        return newObject;
    }

    public readonly serialize = (object: Object): string => {
        let newObject: Object = this.recursiveAddClassProperty(object);
        return JSON.stringify(newObject);
    }

    private readonly reviver = (key: string, value: any) => {
        if (!(value instanceof Object) || !value.__class__) {
            return value;
        }

        let className = value.__class__;
        let returnObject: Object = new this.constructorMapper[className]();        

        if (!returnObject) {
            console.error(`Object ${JSON.stringify(value)} has field __class__, but is not serializable.`);
            return value;
        }

        delete value.__class__;

        Object.assign(returnObject, value);
        return returnObject;
    }

    public readonly deserialize = <T>(json: string): T => {
        let deserializedObject: T = JSON.parse(json, this.reviver);
        return deserializedObject;
    }
}

export function serializable(defaultConstructor: Constructor) {
    let objectSerializer = ObjectSerializer.getObjectSerializer();
    objectSerializer.addSerializable(defaultConstructor);
}
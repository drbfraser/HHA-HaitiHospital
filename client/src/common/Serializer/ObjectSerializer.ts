/*  Support for object serialization/deserialization without loss of typing
    information.

    This module provides two main features: the ObjectSerializer singleton and
    the @serializable decorator. 
    
    The ObjectSerializer has functionality for registering classes as 
    serializable, serializing, and deserializing objects. All objects can be
    serialized and/or deserialized, but only objects whose classes have been
    registered by the ObjectSerializer before serialization will have their
    types preserved after deserialization.

    The @serializable decorator provides with an alternative to programatically
    registering classes. Classes having this decorator will be automatically
    registered to ObjectSerializer. IMPORTANT: Classes with the decorator MUST
    have a no-argument constructor (may be private).

    This code was adapted from jcalz answer in the post
    https://stackoverflow.com/questions/54427218/parsing-complex-json-objects-with-inheritance.
*/
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

    public readonly registerSerializable = (constructor: Constructor): void => {
        this.constructorMapper[constructor.name] = constructor;
    }

    private readonly addClassNameProperty = (object: Object): Object => {
        if (!this.constructorMapper[object.constructor.name]) {
            return object;
        }

        let newObject = Object.create(object);
        Object.assign(newObject, object);
        newObject.__class__ = object.constructor.name;
        return newObject;
    }

    private readonly recursiveAddClassNameProperty = (object: any): any => {
        if (!(object instanceof Object) || object instanceof Function) {
            return object;
        }

        Object.entries(object)
            .forEach(([key, value]) => {
                object[key] = this.recursiveAddClassNameProperty(value);
            });

        let newObject: Object = this.addClassNameProperty(object);
        return newObject;
    }

    public readonly serialize = (object: Object): string => {
        let newObject: Object = this.recursiveAddClassNameProperty(object);
        return JSON.stringify(newObject);
    }

    // JSON parse will call this function upon each field of the JSON string
    // while it traverses through the fields in preorder order.
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

// The decorator function
export function serializable(defaultConstructor: Constructor) {
    let objectSerializer = ObjectSerializer.getObjectSerializer();
    objectSerializer.registerSerializable(defaultConstructor);
}
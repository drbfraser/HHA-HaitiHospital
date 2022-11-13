import { recursiveConsumeObjectHOF } from '../Utils';

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
    registering classes. "Default" arguments should be provided to this decorator
    which will be used to construct a "mock" class from which the deserialized object
    will be built.

    Refer to ObjectSerializer.spec.ts in tests for usage demonstration.

    This code was adapted from jcalz answer in the post
    https://stackoverflow.com/questions/54427218/parsing-complex-json-objects-with-inheritance.
*/
type Constructor = { new(...args: any[]): {} };

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

    public readonly registerSerializable = (name: string, constructor: Constructor): void => {
        this.constructorMapper[name] = constructor;
    }

    private readonly addClassNameProperty = (object: Object): void => {
        if (!this.constructorMapper[object.constructor.name]) {
            return;
        }

        object['__class__'] = object.constructor.name;
    }
    
    
    private readonly removeClassNameProperty = (object: Object): void => {
        if (!this.constructorMapper[object.constructor.name]) {
            return;
        }

        delete object['__class__'];
    }
    
    private readonly recursiveAddClassNameProperty = 
        recursiveConsumeObjectHOF(this.addClassNameProperty);    

    private readonly recursiveRemoveClassNameProperty = 
        recursiveConsumeObjectHOF(this.removeClassNameProperty);
    
    public readonly serialize = (object: Object): string => {
        this.recursiveAddClassNameProperty(object);
        const ret: string = JSON.stringify(object);
        this.recursiveRemoveClassNameProperty(object);
        return ret;
    }

    /*  JSON parse will call this function upon each field of the JSON string
        while it traverses through the fields in preorder order.

        It takes in a key-value pair, allowing the value to be modified. It
        returns an object or value that is going to be assigned to the given
        key in the newly-parsed object.

        For more info, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter
    */
    private readonly reviver = (key: string, value: any): any => {
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

/*  Registers a class as serializable/deserializable by the ObjectSerializer.
    
    The decorator takes in a variable number of arguments which should
    correspond to the arguments that would be passed to the constructor for
    the succesfull instantiation of a "mock" object. The constructor is called
    with these arguments every time the corresponding object's deserialization
    is performed.

    IMPORTANT: If the serializable class being deserialized has
    side-effects, those side-effects will occur during deserialization!
*/
export function serializable(...args: any[]) {
    return (constructor: Function)   => {
        let objectSerializer = ObjectSerializer.getObjectSerializer();
        let constr = constructor.bind(null, ...args)
        objectSerializer.registerSerializable(constructor.name, constr);
    }
}
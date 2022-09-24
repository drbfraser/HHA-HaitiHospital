"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializable = exports.ObjectSerializer = void 0;
class ObjectSerializer {
    constructor() {
        this.registerSerializable = (name, constructor) => {
            this.constructorMapper[name] = constructor;
        };
        this.addClassNameProperty = (object) => {
            if (!this.constructorMapper[object.constructor.name]) {
                return object;
            }
            let newObject = Object.create(object);
            Object.assign(newObject, object);
            newObject.__class__ = object.constructor.name;
            return newObject;
        };
        this.recursiveAddClassNameProperty = (object) => {
            if (!(object instanceof Object) || object instanceof Function) {
                return object;
            }
            Object.entries(object)
                .forEach(([key, value]) => {
                object[key] = this.recursiveAddClassNameProperty(value);
            });
            let newObject = this.addClassNameProperty(object);
            return newObject;
        };
        this.serialize = (object) => {
            let newObject = this.recursiveAddClassNameProperty(object);
            return JSON.stringify(newObject);
        };
        /*  JSON parse will call this function upon each field of the JSON string
            while it traverses through the fields in preorder order.
    
            It takes in a key-value pair, allowing the value to be modified. It
            returns an object or value that is going to be assigned to the given
            key in the newly-parsed object.
    
            For more info, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter
        */
        this.reviver = (key, value) => {
            if (!(value instanceof Object) || !value.__class__) {
                return value;
            }
            let className = value.__class__;
            let returnObject = new this.constructorMapper[className]();
            if (!returnObject) {
                console.error(`Object ${JSON.stringify(value)} has field __class__, but is not serializable.`);
                return value;
            }
            delete value.__class__;
            Object.assign(returnObject, value);
            return returnObject;
        };
        this.deserialize = (json) => {
            let deserializedObject = JSON.parse(json, this.reviver);
            return deserializedObject;
        };
        this.constructorMapper = {};
    }
}
exports.ObjectSerializer = ObjectSerializer;
_a = ObjectSerializer;
ObjectSerializer.getObjectSerializer = () => {
    if (!_a.objectSerializer) {
        _a.objectSerializer = new ObjectSerializer();
    }
    return _a.objectSerializer;
};
/*  Registers a class as serializable/deserializable by the ObjectSerializer.
    
    The decorator takes in a variable number of arguments which should
    correspond to the arguments that would be passed to the constructor for
    the succesfull instantiation of a "mock" object. The constructor is called
    with these arguments every time the corresponding object's deserialization
    is performed.

    IMPORTANT: If the serializable class being deserialized has
    side-effects, those side-effects will occur during deserialization!
*/
function serializable(...args) {
    return (constructor) => {
        let objectSerializer = ObjectSerializer.getObjectSerializer();
        let constr = constructor.bind(null, ...args);
        objectSerializer.registerSerializable(constructor.name, constr);
    };
}
exports.serializable = serializable;

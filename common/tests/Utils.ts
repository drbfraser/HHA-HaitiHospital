export function verifySerialized(original: any, deserialized: any): boolean {
	if (!(original instanceof Object) || original instanceof Function) {
		return typeof(original) === typeof(deserialized) && original === deserialized;
	}
	
	Object.entries(original)
		.forEach(([key, value]) => {
		verifySerialized(value, deserialized[key])
	});
	
	return original.constructor === deserialized.constructor;
}		

export function verifySerialized(original: any, deserialized: any): boolean {
	if (deserialized === undefined && original != undefined && !(original instanceof Function)) {
		 return false;
	}
	
	if (deserialized === undefined && original instanceof Function) {
		return true;
	}
	
	if (!(original instanceof Object)) {
		return typeof(original) === typeof(deserialized) && original === deserialized;
	}
	
	let accumulator = true;	
	Object.entries(original)
		.forEach(([key, value]) => {
		if (!accumulator) {
			return;
		};

		accumulator &&= verifySerialized(value, deserialized[key]);
		});
	
	return accumulator && original.constructor === deserialized.constructor;
}		

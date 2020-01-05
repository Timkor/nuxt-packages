

export function normalizePackage(packageDescriptor) {

    if (typeof packageDescriptor === 'string') {
        
        return {
            name: packageDescriptor
        };

    } else if (typeof packageDescriptor === 'array') {
        
        const [name, options] = packageDescriptor;

        return {
            name,
            options
        };
    } else if (typeof packageDescriptor === 'object') {
        
        return packageDescriptor;
    }
}
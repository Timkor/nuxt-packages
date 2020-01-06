import path from 'path';

export function resolvePackage(name, searchPaths) {    

    return {
        packageFile: require.resolve(name, {
            paths: searchPaths
        }),

        packageDir: path.dirname(require.resolve(`${name}/package.json`, {
            paths: searchPaths
        })).replace(/\\/g, '/') + '/'
    };
}

export function normalizePackage(packageDescriptor) {

    if (typeof packageDescriptor === 'string') {
        
        return {
            name: packageDescriptor
        };

    } else if (Array.isArray(packageDescriptor)) {
        
        const [name, options] = packageDescriptor;

        return {
            name,
            options
        };
    } else if (typeof packageDescriptor === 'object') {
        
        return packageDescriptor;
    }
}

export async function importPackage(path, nuxt, options) {

    const nodeModule = await import(path);

    // Validate nodeModule.default here with Joi

    return nodeModule.default;
}

function resolvePackage(name, searchPaths) {
    try {
        
        return require.resolve(name, {
            paths: searchPaths
        });

    } catch (e) {
        return null;
    }
}

async function importPackage(path) {

    const nodeModule = await import(path);

    console.log(nodeModule.default);

}

export function createModule(normalizedPackage) {

    const {name, options} = normalizedPackage;

    
    

    return async function () {

        // console.log(this.options);
        
        // Make sure Nuxt will transpile imported files from this module:
        this.options.build.transpile.push(name);

        const path = resolvePackage(name, this.options.modulesDir);

        if (path) {
            importPackage(path);
        }
        
        console.log('b');
        console.log('Package module setup', name);
    }
}
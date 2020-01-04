
function normalizePackage(packageDescriptor) {

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
    }
}

function createPackageModule({name}) {

    return async function () {

        // console.log(this.options);
        
        // Make sure Nuxt will transpile imported files from this module:
        this.options.build.transpile.push(name);

        
        try {
            
            // Resolve index.js in package:
            const path = require.resolve(name, {
                paths: this.options.modulesDir
            });

            console.log('path', path);

        } catch (e) {
            console.error(e);
        }
        
        console.log('b');
        console.log('Package module setup', name);
    }
}

export default function(moduleOptions) {

    const packages = this.options.packages;

    packages.forEach(packageDescriptor => {

        // Normalize package:
        const normalizedPackage = normalizePackage(packageDescriptor);

        // Create a module from a package:
        const packageModule = createPackageModule(normalizedPackage);

        // Add the module to the module container:
        this.nuxt.moduleContainer.addModule(packageModule);
    })

    console.log(moduleOptions);
    console.log('Packages', packages);
}
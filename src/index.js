
function normalizePackage(packageDescriptor) {

    if (typeof packageDescriptor === 'string') {
        return {
            name: packageDescriptor
        };
    }
}

function createPackageModule(normalizedPackage) {

    return function () {
        console.log('Package module setup', normalizedPackage);
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
    console.log(packages);
}
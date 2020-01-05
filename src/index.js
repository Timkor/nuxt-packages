
import { normalizePackage } from './helpers/package';
import { createModule } from './helpers/module';

export default function(moduleOptions) {

    this.options.packages.forEach(packageDescriptor => {

        // Normalize package:
        const normalizedPackage = normalizePackage(packageDescriptor);

        // Create a module from a package:
        const packageModule = createModule(normalizedPackage);

        // Add the module to the module container:
        this.nuxt.moduleContainer.addModule(packageModule);
        
    });
}
import path from 'path';
import { resolvePackage, importPackage } from './package';
import { resolvePlugin, normalizePlugin } from './plugin';
import { resolveFiles, supportedExtensions } from './files';
import { createRoutes } from '@nuxt/utils';

export function createModule({name, options}) {

    // Module function:
    return async function () {

        // Make sure Nuxt will transpile imported files from this module:
        this.options.build.transpile.push(name);

        // Resolve package paths:
        const { packageFile, packageDir } = resolvePackage(name, this.options.modulesDir);

        // Import and validate:
        const { setup, plugins, modules, store } = await importPackage(packageFile);

        // Call setup function:
        if (setup) {
            setup.call(this, options);
        }

        // Apply all stores:
        if (store) {
            store.forEach(storeDescriptor => {
                
                const src = storeDescriptor;

                const dst = path.join('nuxt-packages/stores', path.basename(src));

                this.addTemplate({
                    src: path.resolve(__dirname, '../templates/store.js'),
                    fileName: dst,
                    options: {
                        path: src.replace('~', name),
                        name: path.basename(src).split('.')[0]
                    }
                });

                // Add plugin to beginning!:
                this.options.plugins.unshift({
                    src: path.join(this.options.buildDir, dst),
                    ssr: true
                });
            });
        }
        
        // Apply all plugins:
        if (plugins) {
            
            plugins.forEach((pluginDescriptor) => {

                const { src, ssr } = normalizePlugin(pluginDescriptor);

                const dst = path.join('nuxt-packages/plugins', path.basename(src));

                this.addTemplate({
                    src: path.resolve(__dirname, '../templates/plugin.js'),
                    fileName: dst,
                    options: {
                        path: src.replace('~', name)
                    }
                });

                // Add plugin:
                this.options.plugins.push({
                    src: path.join(this.options.buildDir, dst),
                    ssr
                });
            });
        }

        // Apply all pages:
        if (true) {
            
            const pagesDir = path.join(packageDir, 'pages').replace(/\\/g, '/');
            const files = await resolveFiles(pagesDir);
            
            if (files.length) {

                function fixRoute(route) {

                    var children;

                    // Recursively fix children routes:
                    if (route.children) {
                        children = route.children.map(fixRoute);
                    }

                    // Fix this route's chunk name:
                    return {
                        ...route,
                        chunkName: route.chunkName.replace(packageDir, ''),
                        children
                    }
                }

                // Add routes:
                this.extendRoutes((routes) => {

                    const createdRoutes = createRoutes({
                        files,
                        srcDir: this.options.srcDir,
                        pagesDir: pagesDir,
                        routeNameSplitter: '-',
                        supportedExtensions: supportedExtensions,
                        trailingSlash: false
                    }).map(fixRoute);

                    createdRoutes.forEach(createdRoute => routes.push(createdRoute));
                });
            }
        }
    }
}
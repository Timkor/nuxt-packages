import path from 'path';
import { resolvePackageFile, resolvePackageDir, importPackage } from './package';
import { resolvePlugin, normalizePlugin } from './plugin';
import { resolveFiles, supportedExtensions } from './files';
import { createRoutes } from '@nuxt/utils';

export function createModule(normalizedPackage) {

    const {name, options} = normalizedPackage;

    // Module function:
    return async function () {

        // Make sure Nuxt will transpile imported files from this module:
        this.options.build.transpile.push(name);

        const packagePath = resolvePackageFile(name, this.options.modulesDir);

        if (path) {

            const packageDir = resolvePackageDir(name, this.options.modulesDir);

            const { setup, plugins, modules, store } = await importPackage(packagePath);

            // Call setup function:
            if (setup) {
                setup.call(this, options);
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
}
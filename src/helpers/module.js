import path from 'path';
import { resolvePlugin, normalizePlugin } from './plugin';
import Glob from 'glob';
import pify from 'pify';

import { createRoutes } from '@nuxt/utils';

const glob = pify(Glob);
const supportedExtensions = ['vue', 'js'];

function globPathWithExtensions (path) {
    return `${path}/**/*.{${supportedExtensions.join(',')}}`
}

async function resolveFiles(dir) {
    return await glob(globPathWithExtensions(dir));
}

function resolvePackage(name, searchPaths) {
    try {
        
        return require.resolve(name, {
            paths: searchPaths
        });

    } catch (e) {
        return null;
    }
}

async function importPackage(path, nuxt, options) {

    const nodeModule = await import(path);

    // Validate nodeModule.default here with Joi

    return nodeModule.default;
}

export function createModule(normalizedPackage) {

    const {name, options} = normalizedPackage;

    return async function () {

        // console.log(this.options);
        
        // Make sure Nuxt will transpile imported files from this module:
        this.options.build.transpile.push(name);

        const packagePath = resolvePackage(name, this.options.modulesDir);

        

        if (path) {

            const packageDir = path.dirname(require.resolve(`${name}/package.json`, {
                paths: this.options.modulesDir
            })).replace(/\\/g, '/') + '/';

            console.log(packageDir);

            const { setup, plugins, modules, store } = await importPackage(packagePath);

            if (setup) {
                setup.call(this, options);
            }
            
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
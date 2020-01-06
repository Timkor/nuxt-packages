import path from 'path';
import { resolvePlugin, normalizePlugin } from './plugin';

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
            }));

            const { setup, plugins, modules, store } = await importPackage(packagePath);

            if (setup) {
                setup.call(this, options);
            }
            
            if (plugins) {
                
                plugins.forEach((pluginDescriptor) => {

                    

                    const { src, ssr } = resolvePlugin(normalizePlugin(pluginDescriptor), this.options.srcDir, packageDir);

                    const dst = path.join('nuxt-packages/plugins', path.basename(src));

                    const result = this.addTemplate({
                        src: path.resolve(__dirname, '../templates/plugin.js'),
                        fileName: dst,
                        options: {
                            path: '~/' + src
                        }
                    });

                    console.log(result);
                    this.options.plugins.push({
                        src: path.join(this.options.buildDir, dst),
                        ssr
                    });
                });
            }
        }
        
        console.log('b');
        console.log('Package module setup', name);
    }
}
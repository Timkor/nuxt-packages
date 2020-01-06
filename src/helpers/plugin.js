
import path from 'path';

export function normalizePlugin(pluginDescriptor) {

    if (typeof pluginDescriptor === 'string') {
        return {
            src: pluginDescriptor,
            ssr: true
        }
    }
    
    if (typeof pluginDescriptor === 'object') {
        return pluginDescriptor;
    }
}

export function resolvePlugin(normalizedPlugin, srcDir, packageDir) {

    return {
        ...normalizedPlugin,
        src: path.normalize(path.relative(srcDir, normalizedPlugin.src.replace('~', packageDir))).replace(/\\/g, '/')
    }
}

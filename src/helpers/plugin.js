
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

export function resolvePlugin(normalizedPlugin, packageDir) {

    return {
        ...normalizedPlugin,
        src: path.normalize(normalizedPlugin.src.replace('~', packageDir)).replace(/\\/g, '/')
    }
}

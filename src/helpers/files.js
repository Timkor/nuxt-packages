import Glob from 'glob';
import pify from 'pify';

const glob = pify(Glob);

const supportedExtensions = ['vue', 'js'];

function globPathWithExtensions (path) {
    return `${path}/**/*.{${supportedExtensions.join(',')}}`
}

export async function resolveFiles(dir) {
    return await glob(globPathWithExtensions(dir));
}
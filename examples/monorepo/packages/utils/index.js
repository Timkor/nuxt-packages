
/**
 * This utility function will namespace any components given. Seperated by a :
 * 
 * @param {string} namespace Component namespace
 * @param {object} components Object containing the components
 */
export function namespaceComponents(namespace, components) {
    return Object.fromEntries(Object.entries(components).map(([key, value]) => [`${namespace}:${key}`, value]));
}
import {state, mutations, actions, getters} from '<%= options.path %>';

export default ({store}, inject) => {

    const name = '<%= options.name %>';

    store.registerModule(name, {
        namespaced: true,
        state,
        mutations,
        actions,
        getters
    }, { preserveState: !!store.state[name] });
}
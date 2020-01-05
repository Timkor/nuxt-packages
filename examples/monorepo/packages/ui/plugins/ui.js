

export default (context, inject) => {

    inject('ui', {
        test: () => {
            console.log('test');
        }
    })
}
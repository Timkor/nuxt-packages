import message from './test'

export default (context, inject) => {

    inject('ui', {
        test: () => {
            console.log(message);
        }
    })
}

const get_error_msg = (response) => {
    let error_message = '';
    
    const resp_keys = Object.keys(response.data);

    resp_keys.forEach(key => {
        error_message = response.data[key]

        if (typeof error_message !== 'string') {
            error_message = error_message[0]
        }
    });

    return error_message;
}

export { get_error_msg };
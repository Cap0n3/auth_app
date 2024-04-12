
/**
 * Extracts error objects from response object.
 *
 * @param {object} response - The response object containing the error data.
 * @returns {object} - Error objects containing error types and messages.
 */
const extractResponseErrors = (response) => {
    let error_obj = [];

    // Check if response.data exists and has keys
    if (response.data && typeof response.data === 'object') {
        const resp_keys = Object.keys(response.data);

        resp_keys.forEach(key => {
            let error_data = response.data[key];

            for (const [errorType, message] of Object.entries(error_data)) {
                let tmp_obj = {
                    type: errorType,
                    message: message
                };
                error_obj.push(tmp_obj);
            }
        });
    }
    
    return error_obj;
}

/**
 * Formats error messages.
 * 
 * @param {array} errors - An array of error objects.
 * @returns {string} - A formatted string containing error messages.
 */
function formatErrorMessages(errors) {
    if(errors.length > 1) {
        return errors.map((error, index) => {
            return (
                <li key={index}>{error.message}</li>
            );
        });
    } else {
        return errors[0].message;
    }
}

/**
 * Extracts error messages from error object.
 * 
 * @param {object} error - The error object from the response.
 * @returns {string} - A formatted string containing error messages.
 */
function getErrorMessages(error) {
    const error_objects = extractResponseErrors(error.response);
    return formatErrorMessages(error_objects);
}

export { extractResponseErrors, formatErrorMessages, getErrorMessages };

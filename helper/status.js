var response = (statusCode, message) => {
  if (statusCode >= 500) {
    return JSON.stringify({
      success: false,
      statusCode: statusCode,
      response: message
    });
  } else if (statusCode >= 400) {
    return JSON.stringify({
      success: false,
      statusCode: statusCode,
      response: message
    });
  } else if (statusCode >= 300) {
    return JSON.stringify({
      success: true,
      statusCode: statusCode,
      response: message
    });
  } else if (statusCode >= 200) {
    return {
      success: true,
      statusCode: statusCode,
      response: message
    };
  }
};

exports.response = response;

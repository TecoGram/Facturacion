const request = require('superagent');

const postRequest = params => {
  const builder = request.post(params.host + params.path);

  params.headers.forEach(header => builder.set(header.key, header.value));

  return builder
    .set('Accept', 'application/json')
    .send(params.body)
    .then(res => res.body);
};

module.exports = { postRequest };

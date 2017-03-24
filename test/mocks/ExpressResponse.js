
class ExpressResponse {
  constructor() {
    this.sentContent = ""
    this.status = this.status.bind(this);
    this.send = this.send.bind(this);
  }

  status(statusCode) {
    this.statusCode = statusCode
    return this
  }

  send(content) {
    this.sentContent = content
  }
}

module.exports = ExpressResponse

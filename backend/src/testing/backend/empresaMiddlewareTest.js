/* eslint-env node, mocha */

const chai = require('chai');
chai.should();
const {
  serveBiocled,
  serveTecogram
} = require('../../backend/empresaMiddleware.js');
const ExpressResponse = require('../mocks/ExpressResponse.js');

const testEmpresaAsync = function(serveFunction, nombreEmpresa, done) {
  const res = new ExpressResponse();
  serveFunction(null, res);
  setTimeout(function() {
    res.sentContent.should.have.string(`"empresa":"${nombreEmpresa}"`);
    done();
  }, 20);
};

describe('empresaMiddleware.js', function() {
  it('retorna html con el default state de teco', function(done) {
    testEmpresaAsync(serveTecogram, 'TecoGram S.A.', done);
  });
  it('retorna html con el default state de biocled', function(done) {
    testEmpresaAsync(serveBiocled, 'Biocled', done);
  });
});

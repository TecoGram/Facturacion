const { serveBiocled, serveTecogram } = require('./empresaMiddleware.js');
const ExpressResponse = require('./testing/mocks/ExpressResponse.js');

const testEmpresaAsync = serveFunction =>
  new Promise(resolve => {
    const res = new ExpressResponse();
    serveFunction(null, res);
    setTimeout(() => {
      resolve(res.sentContent);
    }, 20);
  });

describe('empresaMiddleware.js', () => {
  it('retorna html con el default state de teco', async () => {
    const sentContent = await testEmpresaAsync(serveTecogram);
    expect(sentContent).toEqual(
      expect.stringMatching(/"empresa":"TecoGram S.A."/)
    );
  });

  it('retorna html con el default state de biocled', async () => {
    const sentContent = await testEmpresaAsync(serveBiocled);
    expect(sentContent).toEqual(expect.stringMatching(/"empresa":"Biocled"/));
  });
});

const fs = require('fs');

const server = require('./server.js');
const setup = require('./scripts/setupDB.js');

describe('API server', () => {
  beforeAll(setup);
  afterAll(server.destroy);

  it('crea el directorio /tmp/facturas/ durante startup', () => {
    //se asume que el test se ejecuta en la raiz del proyecto
    const facturaDir = '/tmp/facturas/';
    expect(fs.existsSync(facturaDir)).toBe(true);
  });
});

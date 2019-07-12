let ajustes;

if (window.__PRELOADED_STATE__) {
  ajustes = window.__PRELOADED_STATE__;
} else
  ajustes = {
    empresa: 'Mi Empresa',
    iva: 12,
    main: true,
    empresas: ['Mi Empresa', 'Mi Alt Empresa']
  };

export default ajustes;

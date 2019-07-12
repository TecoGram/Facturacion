let ajustes;

if (window.__PRELOADED_STATE__) {
  ajustes = window.__PRELOADED_STATE__;
} else
  ajustes = {
    empresa: 'Teco-Gram S.A.',
    iva: 12,
    main: true,
    empresas: ['Teco-Gram S.A.', 'Mi Alt Empresa']
  };

export default ajustes;

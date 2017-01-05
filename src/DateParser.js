module.exports = {
  verVenta (resp) {
    const { cliente, facturaData, productos } = resp
    const _facturaData = Object.assign({}, facturaData)
    _facturaData.fecha = new Date(facturaData.fecha)
    const _productos = []

    let i
    for (i = 0; i < productos.length; i++) {
      const p = productos[i]
      const _p = Object.assign({}, p)
      _p.fechaExp = new Date(p.fechaExp)
      _productos.push(_p)
    }

    return {
      cliente: cliente,
      facturaData: _facturaData,
      productos: _productos,
    }
  },
}

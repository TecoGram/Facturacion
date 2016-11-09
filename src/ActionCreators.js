const nuevoClienteDialog ="muevoClienteDialog"
const nuevoProductoDialog ="muevoProductoDialog"

module.exports = {
  mostrarDialog(tipo) {
    if(tipo === nuevoClienteDialog)
      return {
        tipo: nuevoClienteDialog,
        open: true,
      }
    else if (tipo === nuevoProductoDialog)
      return {
        tipo: nuevoProductoDialog,
        open: true,
      }
    else throw new Error("Tipo de dialog desconocido: " + tipo)
  },
}

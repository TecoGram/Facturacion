import { NUEVO_CLIENTE_DIALOG, NUEVO_PRODUCTO_DIALOG } from './DialogTypes'
import { CAMBIAR_DIALOG_ACTION } from './ActionTypes'

module.exports = {
  cambiarDialog(tipoDialog) {
    if(tipoDialog === NUEVO_CLIENTE_DIALOG)
      return {
        type: CAMBIAR_DIALOG_ACTION,
        value: NUEVO_CLIENTE_DIALOG,
      }
    else if (tipoDialog === NUEVO_PRODUCTO_DIALOG)
      return {
        type: CAMBIAR_DIALOG_ACTION,
        value: NUEVO_PRODUCTO_DIALOG,
      }
    else if (tipoDialog) throw new Error("Tipo de dialog desconocido: " + tipoDialog)
    else return {//null value hides the dialog
      type: CAMBIAR_DIALOG_ACTION,
      value: null,
    }
  },
}

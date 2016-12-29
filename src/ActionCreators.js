import { NUEVO_CLIENTE_DIALOG, NUEVO_PRODUCTO_DIALOG,
  NUEVO_CLIENTE_DIALOG_CLOSED, NUEVO_PRODUCTO_DIALOG_CLOSED } from './DialogTypes'
import { CAMBIAR_DIALOG_ACTION, CERRAR_DIALOG_CON_MSG_ACTION,
  ABRIR_LINK_CON_SNACKBAR } from './ActionTypes'

module.exports = {
  cambiarDialog(tipoDialog) {
    switch (tipoDialog) {
      case NUEVO_CLIENTE_DIALOG:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: NUEVO_CLIENTE_DIALOG,
        }
      case NUEVO_PRODUCTO_DIALOG:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: NUEVO_PRODUCTO_DIALOG,
        }
      case NUEVO_CLIENTE_DIALOG_CLOSED:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: NUEVO_CLIENTE_DIALOG_CLOSED,
        }
      case NUEVO_PRODUCTO_DIALOG_CLOSED:
        return {
          type: CAMBIAR_DIALOG_ACTION,
          value: NUEVO_PRODUCTO_DIALOG_CLOSED,
        }
      default:
        throw new Error("Tipo de dialog desconocido: " + tipoDialog)
    }
  },
  
  cerrarDialogConMsg(msg, dialogType) {
    if(dialogType !== NUEVO_PRODUCTO_DIALOG_CLOSED
      && dialogType !== NUEVO_CLIENTE_DIALOG_CLOSED)
      throw Error('Para cerrar el dialog es necesario un tipo que termine en _CLOSED')
    return {
      type: CERRAR_DIALOG_CON_MSG_ACTION,
      dialog: dialogType,
      message: msg,
    }
  },

  abrirLinkConSnackbar(msg, link) {
    return {
      type: ABRIR_LINK_CON_SNACKBAR,
      message: msg,
      link: link,
    }
  },
}

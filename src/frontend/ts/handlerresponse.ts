interface HandleResponse{
    // Cargar pantalla principal con lista de dispositivos
    cargarGrilla(listaDisp: Array<Device>);
    // Precargar el form del modal de editar dispositivo con los valores actuales
    cargarModalUpdate(disp:Array<Device>);
  }
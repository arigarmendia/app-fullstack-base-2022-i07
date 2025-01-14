class Framework{

    public ejecutarRequest(metodo: string, url: string, responseHandler:HandleResponse, data?: any) {
      let xmlHttp = new XMLHttpRequest();
      
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
          // Si se pidio editar, se ejecuta esta API distinta a todas para traer los datos existentes 
          // y que el modal muestre los valores actuales
          if (metodo == "GET" && url.includes(`/buscarDispositivo`) ) { 
            let disp:Array<Device> = JSON.parse(xmlHttp.responseText);
            console.log("vinieron a buscar un solo dispositivo, y la respuesta fue:" + xmlHttp.responseText);
            responseHandler.cargarModalUpdate(disp);
          

          } else if (xmlHttp.status == 200 && url.includes(`/devices`) ) {
            console.log("DEBUG: - MANDO Respuesta de la consulta a dispositivos");
            let listaDisp: Array<Device> = JSON.parse(xmlHttp.responseText);
            responseHandler.cargarGrilla(listaDisp);
            console.log("DEBUG: - RECIBI de la consulta a dispositivos");

         } else if (xmlHttp.status != 200) {
                  alert("ERROR en la consulta");
              }
              
          }
      }
      xmlHttp.open(metodo, url, true);
      if (data != undefined) {
        xmlHttp.setRequestHeader("Content-Type", "application/json");  
        xmlHttp.send(JSON.stringify(data));
  
      } else {
        
        xmlHttp.send();
      }
    }
    
  }
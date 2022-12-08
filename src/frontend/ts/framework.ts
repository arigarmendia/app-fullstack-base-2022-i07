class Framework{

    // public ejecutarRequest(metodo: string, url: string, responseHandler:HandleResponse, data?: any) {
    //   let xmlHttp = new XMLHttpRequest();
      
    //   xmlHttp.onreadystatechange = () => {
    //     if (xmlHttp.readyState == 4) {
            
    //           if (xmlHttp.status == 200) {
    //             console.log("DEBUG: - MANDO Respuesta de la consulta a dispositivos");
    //             let listaDisp: Array<Device> = JSON.parse(xmlHttp.responseText);
    //             responseHandler.cargarGrilla(listaDisp);
    //             console.log("DEBUG: - RECIBI de la consulta a dispositivos");
    //           } else {
    //               alert("ERROR en la consulta");
    //           }
              
    //       }
    //       }
    //   xmlHttp.open(metodo, url, true);
    //   if (data != undefined) {
    //     xmlHttp.setRequestHeader("Content-Type", "application/json");  
    //     xmlHttp.send(JSON.stringify(data));
  
    //   } else {
        
    //     xmlHttp.send();
    //   }
    // }
    public ejecutarRequest(metodo: string, url: string, responseHandler:HandleResponse, data?: any) {
      let xmlHttp = new XMLHttpRequest();
      
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
          if (metodo == "GET" && url.includes(`/buscarDispositivo/`) ) { 
            let disp:Array<Device> = JSON.parse(xmlHttp.responseText);
            console.log("vinieron a buscar un solo dispositivo, y la respuesta fue:" + xmlHttp.responseText);
            responseHandler.cargarModalUpdate(disp);
          }
          else 
              if (xmlHttp.status == 200) {
                console.log("DEBUG: - MANDO Respuesta de la consulta a dispositivos");
                let listaDisp: Array<Device> = JSON.parse(xmlHttp.responseText);
                responseHandler.cargarGrilla(listaDisp);
                console.log("DEBUG: - RECIBI de la consulta a dispositivos");
              } else {
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
    public mostrarCargando() {
      let imgLoading = document.getElementById("loading");
      imgLoading.hidden = false;
    }
    public ocultarCargando() {
      let imgLoading = document.getElementById("loading");
      imgLoading.hidden = true;
    }
  }
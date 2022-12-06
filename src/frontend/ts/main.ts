
class Main implements EventListenerObject,HandleResponse{
 
    private framework: Framework = new Framework();
   
    cosultarDispositivoAlServidor() {

        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }


    cambiarEstadoDispositivoAlServidor() {
        let json = { id: 1, state: 0 };
        this.framework.ejecutarRequest("POST", "http://localhost:8000/deviceChange",this,json);
        
    }
    cargarGrilla(listaDisp: Array<Device>) {
        console.log("llego info del servidor", listaDisp);    
        let cajaDips = document.getElementById("cajaDisp");
        let grilla:string = "<ul class='collection'>";
        for (let disp of listaDisp) {
        

            grilla += ` <li class="collection-item avatar">`;
            
            if (disp.type == 1) {
                grilla+=`<img src="static/images/lightbulb.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/window.png" alt="" class="circle"> `  
            }
            
            grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content">
              <div class="switch">
                  <label>
                    Off`;
            if (disp.state) {
                grilla += `<input id="cb_${disp.id}" type="checkbox" checked>`;    
            } else {
                grilla += `<input id="cb_${disp.id}" type="checkbox">`;    
            }
            
            
            grilla +=`<span class="lever"></span>
                    On
                  </label>
                </div>
          </a>
          </li>`;
        }
        grilla += "</ul>"
        
        cajaDips.innerHTML = grilla;

        for (let disp of listaDisp) {
            let cb = document.getElementById("cb_" + disp.id);
            cb.addEventListener("click", this);
        }
        
        this.framework.ocultarCargando();
        
    }

    handleEvent(object: Event): void {
     
        let tipoEvento:string=object.type;
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        if(objEvento.id=="btnOtro"){
            console.log(objEvento.id, objEvento.textContent); 
            
            let iNombre =<HTMLInputElement> document.getElementById("iNombre");
            
            objEvento.textContent = iNombre.value;
            alert("hola estoy en el main");
        } else if (objEvento.id == "btnSaludar") {
          
            this.framework.mostrarCargando();
            this.cosultarDispositivoAlServidor();

      
        } else if (objEvento.id.startsWith("cb_")) {
            let idDisp = objEvento.id.substring(3);
            
            alert("Se cambio el estado del dispositivo " + idDisp + " -" + (<HTMLInputElement>objEvento).checked);

       
            
        }

    }
}


window.addEventListener("load", () => {
    let main: Main = new Main();
    main.cosultarDispositivoAlServidor();

});




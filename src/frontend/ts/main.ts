declare const M;

// Defino la clase Main
class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();
   
    cosultarDispositivoAlServidor() {

        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    // Modificacion de dispositivo existente
    cambiarEstadoDispositivoAlServidor() {
        let json = { id: 1, state: 0 };
        this.framework.ejecutarRequest("POST", "http://localhost:8000/deviceChange",this,json);
        
    }
    // Alta de nuevo dispositivo
    altaDispositivo() {
        let json = { id: 1, state: 0 };
        this.framework.ejecutarRequest("POST", "http://localhost:8000/deviceChange",this,json);
        
    }

    // Para dibujar la grilla con los elementos 
    cargarGrilla(listaDisp: Array<Device>) {
        console.log("llego info del servidor", listaDisp);    
        let cajaDips = document.getElementById("cajaDisp");
        let grilla:string = "<ul class='collection'>";
        for (let disp of listaDisp) {
        

            grilla += ` <li class="collection-item avatar">`;
            
            // Elijo ícono dependiendo qué tipo de dispositivo es
            if (disp.type == 1) {
                grilla+=`<img src="static/images/light.png" alt="" class="circle"> `   
            } else {
                grilla+=`<img src="static/images/fan.png" alt="" class="circle"> `  
            }
            
            // Nombre y descripción del dispositivo
            grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content">
              <div class="switch">
                  <label>
                    Off`;

            // Para graficar botón prendido o apagado dependiendo del valor guardado
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
        // Armar la grilla
        grilla += "</ul>"
        
        cajaDips.innerHTML = grilla;

        for (let disp of listaDisp) {
            let cb = document.getElementById("cb_" + disp.id);
            cb.addEventListener("click", this);
        }
        
        this.framework.ocultarCargando();
        
    }
    // Aquí se manejan las distintas actividades que puedan ocurrir
    handleEvent(object: Event): void {
     
        // Cuando termine de cargar la página web, recuperar los elementos tipo "select"
        // Inicializarlos vacíos
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, "");

        let tipoEvento:string=object.type;
        let objEvento: HTMLElement;
        objEvento = <HTMLElement>object.target;
        // Si se apretó boton otro
        if(objEvento.id=="btnOtro"){
            console.log(objEvento.id, objEvento.textContent); 
            
            let iNombre =<HTMLInputElement> document.getElementById("iNombre");
            
            objEvento.textContent = iNombre.value;
            alert("hola estoy en el main");
        // Si se apretó boton saludar
        } else if (objEvento.id == "btnAgregar") {
          
            this.framework.mostrarCargando();
            this.cosultarDispositivoAlServidor();

        // Cambiar el estado de un dispositivo
        } else if (objEvento.id.startsWith("cb_")) {
            let idDisp = objEvento.id.substring(3);
            
            alert("Se cambio el estado del dispositivo " + idDisp + " -" + (<HTMLInputElement>objEvento).checked);
            
        }

    }
}

// Instancio la clase Main
window.addEventListener("load", () => {

    // Modal boton "NUEVO"
    var elemsM = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsM, "");

    // Dropdown dentro del modal NUEVO
    var elemsI = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elemsI, "");

    let main: Main = new Main();
    main.cosultarDispositivoAlServidor();

});




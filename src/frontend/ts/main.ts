declare const M;

// Defino la clase Main
class Main implements EventListenerObject, HandleResponse{
 
    private framework: Framework = new Framework();
   
    cosultarDispositivoAlServidor() {

        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    // Alta de nuevo dispositivo
    altaDispositivo(nombre, tipo, descripcion) {
        let json = {name: nombre, description: descripcion, state: 0, type: tipo };
        console.log("vino a alta dispositivo");
        this.framework.ejecutarRequest("POST", "http://localhost:8000/nuevoDispositivo",this,json);
        
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
          <div class=  row s6> <a class="waves-effect waves-light btn-small" id="bb_${disp.id}" >Eliminar</a> <div>
          </li>`;
        }
        // Armar la grilla
        grilla += "</ul>"
        
        cajaDips.innerHTML = grilla;

        for (let disp of listaDisp) {
            let cb = document.getElementById("cb_" + disp.id);
            cb.addEventListener("click", this);

            // borrar dispositivo
            let btnborrar = document.getElementById('bb_' + disp.id);
            btnborrar.addEventListener("click", this);
           
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

        // Si se pide alta de nuevo dispositivo
        if (objEvento.id == 'alta') {
            let nombre = (<HTMLInputElement>document.getElementById("nombre")).value;
            let tipo = (<HTMLInputElement>document.getElementById("tipo")).value;
            let descripcion = (<HTMLInputElement>document.getElementById("descripcion")).value;
            console.log(nombre);
            this.altaDispositivo(nombre, tipo, descripcion);
            this.cosultarDispositivoAlServidor();
            


        
        // Si se apretó boton otro
        } else if(objEvento.id=="btnOtro"){
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
    var elemsD = document.querySelectorAll('select');
    var instancesD = M.FormSelect.init(elemsD, "");

    
    let main: Main = new Main();
    main.cosultarDispositivoAlServidor();
    
    let aceptar = document.getElementById("alta")
    aceptar.addEventListener("click", main);


});




declare const M;

// Defino la clase Main
class Main implements EventListenerObject, HandleResponse{
    
    private temp_id:string = "0";
    private temp_state:string = "0";
    private temp_nombre:string = "0";
    private temp_desc:string = "0";
    private temp_tipo:string = "0";
    

    private framework: Framework = new Framework();
   
    // Traer lista de dispositivos
    cosultarDispositivoAlServidor() {
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices",this);
    }

    cosultarUnSoloDispositivoAlServidor(deviceID) {
        this.framework.ejecutarRequest("GET", `http://localhost:8000/buscarDispositivo/?deviceID=${deviceID}`,this);
    }

    // Alta de nuevo dispositivo
    altaDispositivo(nombre, tipo, descripcion) {
        let json = {name: nombre, description: descripcion, state: 0, type: tipo };
        console.log("vino a alta dispositivo");
        this.framework.ejecutarRequest("POST", "http://localhost:8000/nuevoDispositivo",this,json);
    }

    // Borrar dispositivo a partir de su id
    borrarDispositivo(id) {
        let json = {id: id};
        console.log("vino baja de dispositivo");
        this.framework.ejecutarRequest("POST", "http://localhost:8000/borrarDispositivo",this,json);        
    }
    
    // Cambiar estado de un dispositivo a partir de su id
    cambiarEstado(id, state) {
        let json = {id: id, state: state};
        console.log("vino cambio de estado del dispositivo a"+state);
        this.framework.ejecutarRequest("POST", "http://localhost:8000/cambiarEstadoDispositivo",this,json);
    }

    // Modificar un dispositivo
    modificarDispositivo(id, nombre, descripcion, tipo, estado) {
        let json = {id: id, name: nombre, description: descripcion, type: tipo, state: estado};
        console.log("vino modificacion del dispositivo " + json);
        this.framework.ejecutarRequest("POST", "http://localhost:8000/modificarDispositivo",this, json);            
    }

// llenado del form del modal de update device
    cargarModalUpdate(disp:Array<Device>){
        console.log("Estoy en cargar el modal, disp.name = " + disp[0].name + "descripcion = " + disp[0].description);
        (<HTMLInputElement>document.getElementById("mod_nombre")).value = disp[0].name;
        (<HTMLInputElement>document.getElementById("mod_descripcion")).value = disp[0].description;
        (<HTMLSelectElement>document.getElementById("mod_tipo")).selectedIndex=disp[0].type;
        this.temp_state = (disp[0].state ? "1": "0");

}


    // Para dibujar la grilla con los elementos 
    cargarGrilla(listaDisp: Array<Device>) {
        console.log("llego info del servidor", listaDisp);    
        let cajaDips = document.getElementById("cajaDisp");
        let grilla:string = "<ul class='collection'>";
        for (let disp of listaDisp) {
        

            grilla += ` <li class="collection-item avatar">`;
            
            // Elijo ícono dependiendo qué tipo de dispositivo es
            grilla+=`<img src="static/images/${disp.type}.png" alt="" class="circle"> ` 
            // if (disp.type == 1) {
            //     grilla+=`<img src="static/images/light.png" alt="" class="circle"> `   
            // } else {
            //     grilla+=`<img src="static/images/fan.png" alt="" class="circle"> `  
            // }
            
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
            <div class="container">
                <div class="row">
                    <div class="col s3"> 
                        <a class="waves-effect waves-light btn modal-trigger" id="be_${disp.id}" href="#modalEdit">Editar</a>
                    </div> 
                    <div class="col s3"> 
                        <a class="waves-effect waves-light btn-small" id="bb_${disp.id}" >Borrar</a> 
                    </div>
                </div>
            </div>
          </li>`;
        }
        // Armar la grilla
        grilla += "</ul>"
        
        cajaDips.innerHTML = grilla;

        for (let disp of listaDisp) {
            // Check box
            let cb = document.getElementById("cb_" + disp.id);
            cb.addEventListener("click", this);

            // Borrar dispositivo
            let btnborrar = document.getElementById('bb_' + disp.id);
            btnborrar.addEventListener("click", this);
           
            // Editar dispositivo
            let btneditar = document.getElementById('be_' + disp.id);
            btneditar.addEventListener("click", this);

            let btnconfedit = document.getElementById('edit');
            btneditar.addEventListener("click", this);
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
            
        
        // Si se pide borrar un dispositivo
        } else if (objEvento.id.startsWith("bb_")) {
            let idDis = objEvento.id.substring(3);
            var c = confirm("Esta seguro de que desea borrar el dispositivo?");  
            
            if (c == true) {  
             this.borrarDispositivo(idDis);
             alert("Se borró exitosamente el dispositivo"+idDis);
             this.cosultarDispositivoAlServidor();  
            } 
            //this.borrarDispositivo(idDis);
            //alert("Se borró exitosamente el dispositivo"+idDis);
            //this.cosultarDispositivoAlServidor();


        // Si se pide modificar un dispositivo
        } else if (objEvento.id.startsWith("be_")) {
            
            let idDisp = objEvento.id.substring(3);
            this.temp_id = idDisp ;
            this.cosultarUnSoloDispositivoAlServidor(idDisp);



        }
            // Boton confirmacion de edicion de dispositivo
            // let btnconfedit = document.getElementById('edit');
            // btnconfedit.addEventListener("click", this);
        else if (objEvento.id=="edit") {
            //let idDisp = objEvento.id.substring(3);
            let idDisp = this.temp_id;
            let nombre = (<HTMLInputElement>document.getElementById("mod_nombre")).value;
            let descripcion = (<HTMLInputElement>document.getElementById("mod_descripcion")).value;
            let tipo = (<HTMLSelectElement>document.getElementById("mod_tipo")).selectedIndex;
            let estado = this.temp_state ;
            // let nombre = this.temp_nombre;
            // let tipo = this.temp_tipo;
            // let descripcion = this.temp_desc;
            console.log("Pedi editar con esto: Nombre = " + nombre + " ID: " + idDisp);
            this.modificarDispositivo(idDisp, nombre, descripcion, tipo, estado);
            this.cosultarDispositivoAlServidor();
            //alert("hola estoy en el boton edit");

            
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
            let nuevoEstado: number = 0;
            if ((<HTMLInputElement>objEvento).checked) {
                 nuevoEstado = 1;
            
            } else nuevoEstado = 0;
            console.log("se pidio cambiar el estado del dispositivo a :" + nuevoEstado);
            // Aca llamo a la funcion para cambiar el estado
            this.cambiarEstado(idDisp, nuevoEstado);
            this.cosultarDispositivoAlServidor();
            //
            //alert("Se cambio el estado del dispositivo " + idDisp + " -" + (<HTMLInputElement>objEvento).checked);
            
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
    
    // Boton confirmar que agrego un nuevo elemento
    let aceptar = document.getElementById("alta")
    aceptar.addEventListener("click", main);

    // Boton confirmar que se edito un nuevo elemento
    let botonedit = document.getElementById("edit")
    botonedit.addEventListener("click", main);

    //let borrar = document.getElementById("alta")
    //borrar.addEventListener("click", main);



});




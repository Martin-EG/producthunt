export default function validarCrearCuenta(valores) {
    let errores = {};

    if(!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }
    
    if(!valores.empresa) {
        errores.empresa = "Nombre de empresa/compañia es obligatorio";
    }
    
    if(!valores.url) {
        errores.url = "La url es obligatorio";
    } else if ( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "La url no es valida";
    }

    if(!valores.descripcion) {
        errores.descripcion = "La descripcion es obligatorio";
    }
    

   

    return errores;
}
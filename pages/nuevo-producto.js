import React, { useState, useContext } from 'react';
import { css } from "@emotion/react";
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';

import Layout from "../components/layout/Layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

export default function NuevoProducto() {

  // State de las imagenes
  const [ nombreImagen, guardarNombre ] = useState('');
  const [ subiendo, guardarSubiendo ] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [ urlImagen, guardarUrlImagen ] = useState('');

  const [ error, guardarError ] = useState(null);

  const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: '',
  }

   const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);


  const { nombre, empresa, imagen, url, descripcion } = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  // Context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext)

  async function crearProducto() {
    // Si el usuario no esta autenticado llevar al login
    if ( !usuario ) {
      return router.push('/login');
    }

    // Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      descripcion,
      urlImagen,
      votos: 0,
      comentarios: [],
      creado: Date.now()
    }

    // Insertar en la base de datos
    firebase.db.collection('productos').add(producto);

    return router.push('/');
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  }

  const handleProgress = progreso => guardarProgreso({progreso});

  const handleUploadError = error => {
    guardarSubiendo(error);
    console.error(error);
  }

  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then( url => {
        guardarUrlImagen(url);
      });
  }

  return (
    <div>
      <Layout>
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                <legend>Informacion General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu Nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text"
                    id="empresa"
                    name="empresa"
                    placeholder="Nombre de la Empresa/Compañia"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader 
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu Producto"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.url && <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea 
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>
                

                { error && <Error>{error}</Error> }
                <InputSubmit 
                  type="submit"
                  value="Crear Producto"
                />
            </Formulario>
          </>
      </Layout>
    </div>
  )
}

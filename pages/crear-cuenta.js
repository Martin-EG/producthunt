import React, { useState } from 'react';
import { css } from "@emotion/react";
import Router from 'next/router';
import Layout from "../components/layout/Layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

export default function CrearCuenta() {

  const [ error, guardarError ] = useState(null);

  const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
  }

  const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);


  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al crear al usuario', error.message);
      guardarError(error.message);
    }
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
            >Crear Cuenta</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
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
                <label htmlFor="email">Email</label>
                <input 
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Tu Email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>

              { errores.email && <Error>{errores.email}</Error>}

              <Campo>
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Tu Password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>

              { errores.password && <Error>{errores.password}</Error>}

              { error && <Error>{error}</Error> }
              <InputSubmit 
                type="submit"
                value="Crear Cuenta"
              />
            </Formulario>
          </>
      </Layout>
    </div>
  )
}

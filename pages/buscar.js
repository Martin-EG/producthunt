import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import DetallesProducto from '../components/layout/DetallesProducto';

import useProductos from '../hooks/useProductos';

export default function Buscar() {
  
  const router = useRouter();
  const { query: { q } } = router;
  
  // Todos los productos
  const { productos } = useProductos('creado');
  const [ resultado, guardarResultado ] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter( producto => ( producto.nombre.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda) ));
    guardarResultado(filtro);

  }, [q, productos])

  return (
    <div>
      <Layout>
          <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                { resultado.map( producto => (
                  <DetallesProducto 
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </ul>
            </div>
          </div>
      </Layout>
    </div>
  )
}

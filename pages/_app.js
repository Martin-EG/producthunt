import '../styles/globals.css'
import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAutentificacion from '../hooks/useAutentificacion';

function MyApp({ Component, pageProps }) {
  const usuario = useAutentificacion();

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  )
}

export default MyApp

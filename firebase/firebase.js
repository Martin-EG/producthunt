import app from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';
import 'firebase/firestore';
import 'firebase/storage';

class Firebase {
    constructor() {
        if(!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }

        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    // Registrar un usuario
    async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);

        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        });
    }

    // Iniciar sesion del usuario
    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // Cierra la sesion del usuario
    async cerrarSesion() {
        await this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;
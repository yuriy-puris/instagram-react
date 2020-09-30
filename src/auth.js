import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import defaultUserImage from './images/default-user-image.jpg' 
import { CREATE_USER } from "./graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyBSxjqSXYnUH04qsStp9qWKdiHAHnbF1Wc",
  authDomain: "instagram-app-clone-54786.firebaseapp.com",
  databaseURL: "https://instagram-app-clone-54786.firebaseio.com",
  projectId: "instagram-app-clone-54786",
  storageBucket: "instagram-app-clone-54786.appspot.com",
  messagingSenderId: "947070168125",
  appId: "1:947070168125:web:6752d8f3dc2f0d57410e54",
  measurementId: "G-9JRD5S1BPM"
});

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = React.useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref(`metadata/${user.uid}/refreshTime`);

          metadataRef.on("value", async (data) => {
            if(!data.exists) return
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const data = await firebase.auth().signInWithPopup(provider);
      if ( data.additionalUserInfo.isNewUser ) {
        const { uid, displayName, email, photoURL } = data.user;
        const username = `${displayName.replace(/\s+/g, '')}${uid.slice(-5)}`;
        const variables = {
          userId: uid,
          name: displayName,
          username,
          emal: email,
          bio: '',
          website: '',
          phone_number: '',
          last_checked: '',
          profile_image: photoURL
        }
        await createUser({ variables });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmail = async email => {
    await authState.user.updateEmail(email);
  };

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithEmailAndPassword = async (email, password) => {
    const data = await firebase.auth().signInWithEmailAndPassword(email, password);
    return data;  
  };

  const signUpWithEmailAndPassword = async (formData) => {
    const data = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
    if ( data.additionalUserInfo.isNewUser ) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        emal: data.user.email,
        bio: '',
        website: '',
        phone_number: '',
        last_checked: '',
        profile_image: defaultUserImage
      }
      await createUser({ variables });
    }
  };

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          signInWithGoogle,
          signInWithEmailAndPassword,
          signOut,
          signUpWithEmailAndPassword,
          updateEmail
        }}
      >
        { children }
      </AuthContext.Provider>
    );
  }
}


export default AuthProvider;
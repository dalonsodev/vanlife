import { initializeApp } from "firebase/app"
import { 
   getFirestore, 
   collection, 
   doc, 
   getDocs, 
   getDoc,
   query,
   where
} from "firebase/firestore/lite"

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyC-2tEo_lNUt_sCo8la5aHst1fU-xlkTnc",
   authDomain: "vanlinfe.firebaseapp.com",
   projectId: "vanlinfe",
   storageBucket: "vanlinfe.firebasestorage.app",
   messagingSenderId: "857283792673",
   appId: "1:857283792673:web:aab4a2b0bb1d09fe74f860"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

// Refactoring the fetching functions below
const vansCollectionRef = collection(db, "vans")

export async function getVans() {
   const snapshot = await getDocs(vansCollectionRef)
   const vans = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
   }))

   return vans
}

export async function getVan(id) {
   const docRef = doc(db, "vans", id)
   const snapshot = await getDoc(docRef)
   
   return {
      ...snapshot.data(),
      id: snapshot.id
   }
}

export async function getHostVans() {
   const q = query(vansCollectionRef, where("hostId", "==", "123"))
   const snapshot = await getDocs(q)
   const vans = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
   }))

   return vans
}



export async function loginUser(creds) {
   const res = await fetch("/api/login",
      { method: "post", body: JSON.stringify(creds) }
   )
   const data = await res.json()

   if (!res.ok) {
      throw {
         message: data.message,
         statusText: res.statusText,
         status: res.status
      }
   }

   return data
}
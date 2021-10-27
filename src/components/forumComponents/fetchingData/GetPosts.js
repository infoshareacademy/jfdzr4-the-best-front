import { db } from "../../../index";
import { collection, query, onSnapshot, doc } from "firebase/firestore";

export const getPosts = (setPosts,posts) => {

  const q = query(collection(db, "posts"));
  onSnapshot(q,(querySnapshot) => {
      setPosts([])
    querySnapshot.forEach((doc) => {
      setPosts(prev=>[...prev,{...doc.data(),...{id:doc.id}}]);
      
    });

  });
}

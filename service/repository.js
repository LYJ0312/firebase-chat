import {database} from "../firebase"
class Repository {
    storeInfo(id, info) {
        database.ref(`info/${id}/${info.id}`).set(info);
    }

    deleteInfo(id, info) {
        database.ref(`info/${id}/${info.id}`).remove();
    }
    readInfo(id, onUpdate) {
        const dbRef = database.ref(`info/${id}`);
        dbRef.on('value', snapshot => {
            const data = snapshot.val();
            data && onUpdate(data);
        })
        return dbRef.off;
    }
}
export default Repository;
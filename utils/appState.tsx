import {create} from 'zustand';
interface RoomIdState { //ts를 사용하기때문에 타입지정이 필요
    roomId: String;
    setRoomId: (select: String) => void;
    roomDetails:any;
    setRoomDetails: (value:object) => void;
    loadedUsers:object;
    setLoadedUsers: (user: any, email: any) => void;
}


export const useStore = create<RoomIdState>((set) => ({
    roomId: "",
    setRoomId: (id) => {
        set((state) => ({ ...state, roomId: id }));
    },
    roomDetails: {

    },
    setRoomDetails: (value)=>{
        set(state=>({roomDetails:{...state.roomDetails, ...value}}))
    },
    loadedUsers: {},
    setLoadedUsers: (user, email) => {
        set((state) => ({ loadedUsers: { ...state.loadedUsers, [email]: user } }));
    },
}));
import {createSlice} from "@reduxjs/toolkit"

const initialState={
    currentUser:null,
    error:null,
    loading:false

}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true,
            state.error=null
        },
        signInSuccess:(state,action)=>{
            state.loading=false,
            state.currentUser=action.payload,
            state.error=null
        },
        signInFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        UpdateUserStart:(state)=>{
            state.loading=true,
            state.error=null
        },
        UpdateUserSuccess:(state,action)=>{
            state.loading=false,
            state.currentUser=action.payload,
            state.error=null
        },
        UpdateUserFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        DeleteUserStart:(state)=>{
            state.loading=true,
            state.error=null
        },
        DeleteUserSuccess:(state,action)=>{
            state.loading=false,
            state.currentUser=null
            state.error=null
        },
        DeleteUserFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        SignOut:(state,action)=>{
            state.loading=false,
            state.currentUser=null
            state.error=null
        },
    }
})

export const {signInFailure,signInStart,SignOut, signInSuccess,UpdateUserFailure,UpdateUserStart,UpdateUserSuccess,DeleteUserFailure,DeleteUserStart,DeleteUserSuccess} =userSlice.actions;
export default userSlice.reducer
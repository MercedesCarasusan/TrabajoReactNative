import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({

  name: 'profile',

  initialState: {

    peso: '',
    altura: '',
    edad: '',

    loading: false,
    error: null

  },

  reducers: {

    setProfile: (state, action) => {

      state.peso = action.payload.peso;
      state.altura = action.payload.altura;
      state.edad = action.payload.edad;

    },

    setPeso: (state, action) => {
      state.peso = action.payload;
    },

    setAltura: (state, action) => {
      state.altura = action.payload;
    },

    setEdad: (state, action) => {
      state.edad = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    }

  }

});

export const {
  setProfile,
  setPeso,
  setAltura,
  setEdad,
  setLoading,
  setError
} = profileSlice.actions;

export default profileSlice.reducer;
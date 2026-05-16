import { createSlice } from '@reduxjs/toolkit';

const trainingSlice = createSlice({

    name: 'trainings',

    initialState: {

        trainings: [],
        loading: false,
        error: null,
        filter: 'Todos'

    },

    reducers: {

        setTrainings: (state, action) => {
            state.trainings = action.payload;
        },

        addTraining: (state, action) => {
            state.trainings.unshift(action.payload);
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setFilter: (state, action) => {
            state.filter = action.payload;
        }

    }

});

export const {
    setTrainings,
    addTraining,
    setLoading,
    setError,
    setFilter
} = trainingSlice.actions;

export default trainingSlice.reducer;
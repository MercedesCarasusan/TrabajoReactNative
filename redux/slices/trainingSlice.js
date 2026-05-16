import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteTraining, saveTraining } from '../../services/firebase/trainingService';
import { deleteTrainingImage } from '../../services/local/trainingImageService';

export const saveTrainingThunk = createAsyncThunk(
    'trainings/saveTraining',
    async ({ userId, trainingData }) => {
        const id = await saveTraining(userId, trainingData);

        return {
            id,
            ...trainingData
        };
    }
);

export const deleteTrainingThunk = createAsyncThunk(
    'trainings/deleteTraining',
    async ({ userId, trainingId, foto }) => {
        await deleteTraining(userId, trainingId);
        await deleteTrainingImage(foto);

        return trainingId;
    }
);

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

    },

    extraReducers: (builder) => {
        builder
            .addCase(saveTrainingThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveTrainingThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.trainings.unshift(action.payload);
            })
            .addCase(saveTrainingThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteTrainingThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrainingThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.trainings = state.trainings.filter(
                    training => training.id !== action.payload
                );
            })
            .addCase(deleteTrainingThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
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

/* eslint-disable indent */
const shortiesReducer = (state, action) => {
    switch (action.type) {
        case 'SHORTY_ADD':
            return [...state, action.shorty];

        case 'SHORTY_UPDATE':
            return [...state.filter(shorty => shorty._id !== action.shorty._id), action.shorty];

        case 'SHORTY_DELETE':
            return state.filter(shorty => shorty._id !== action._id);

        case 'REFRESH':
            return [action.shorties];

        default:
            return state;
    }
};

export default shortiesReducer;
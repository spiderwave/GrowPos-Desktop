import { SELECT_CLIENT , ADD_TO_CART , DELETE_FROM_CART , REMOVE_FROM_CART , ADD_FROM_CART , GET_CART_DATA , REFRESH_ACTIVE , GET_ACTIVE ,GET_BILLING_DETAILS} from './types.js'

export const getClient = ( payload ) => {
    return (dispatch) => {
        dispatch({
            type: GET_CART_DATA,
            payload: payload
        })
    }
}
export const GetActive = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: GET_ACTIVE,
            payload: payload
        })
    }
}
export const SelectClient = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: payload
        })
    }
}


export const addToCart = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: ADD_TO_CART,
            payload: payload
        })
    }
}

export const add = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: ADD_FROM_CART,
            payload: payload
        })
    }
}



export const remove = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: REMOVE_FROM_CART,
            payload: payload
        })
    }
}

export const Delete = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: DELETE_FROM_CART,
            payload: payload
        })
    }
}

export const Refresh = ( payload) => {
    return (dispatch) => {
        dispatch({
            type: REFRESH_ACTIVE,
            payload: payload
        })
    }
}

export const BillingDetails = ( name, value ) => {
    return (dispatch) => {
        dispatch({
            type: GET_BILLING_DETAILS,
            name: name,
            value: value,
        })
    }
}
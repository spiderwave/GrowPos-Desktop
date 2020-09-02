import { READ_SHOP_DATA , GET_USER_DATA} from './types.js'


export const ReadShop = (data) => {
    return (dispatch) => {
        dispatch({
            type: READ_SHOP_DATA,
            data: data
        })
    }
}

export const UserData = (data) => {
    return (dispatch) => {
        dispatch({
            type: GET_USER_DATA,
            data: data
        })
    }
}
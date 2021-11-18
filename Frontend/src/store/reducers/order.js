const initialState = {
    quantity: 1,
    brands: ["Real", "Fake", "Pre-owned", "New"],
    address: "",
    location: {
        lat: null,
        lng: null
    },
    cart: [],
    totalQuantity: 0,
    totalPrice: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATEADDRESS": {
            return {
                ...state,
                address: action.address,
                location: {
                    ...state.location,
                    lat: action.location.lat,
                    lng: action.location.lng
                }
            }
        }
        case "CHANGE_BRAND": {
            return {
                ...state,
                brand: action.brand
            }
        }
        case "UPDATE_QUANTITY": {
            if (state.quantity + action.number > 0) {
                return {
                    ...state,
                    quantity: state.quantity + action.number
                }
            } else {
                return state
            }
        }
        case "ADD_TO_CART": {
            // console.log(state.cart);
            const isAdded = state.cart.filter((cartItem) => cartItem.brand === action.brand && cartItem.product === action.product)
            if (isAdded.length > 0) {
                const newData = state.cart.map(cartItem => {
                    if (cartItem.brand === action.brand && cartItem.product === action.product) {
                        return {
                            ...cartItem,
                            price: cartItem.price + (action.price * action.quantity),
                            quantity: cartItem.quantity + action.quantity,
                        }
                    }
                    return cartItem
                });
                return {
                    ...state,
                    cart: newData
                }
            }
            return {
                ...state,
                cart: [
                    ...state.cart,
                    {
                        price: action.price * action.quantity,
                        quantity: action.quantity,
                        brand: action.brand,
                        product: action.product,
                        imageUrl: action.imageUrl
                    }
                ]
            }
        }
        case "UPDATE_TOTAL_QUANTITY": {
            let total = 0
            let totalPrice = 0
            state.cart.forEach(cartItem => {
                total += cartItem.quantity
                totalPrice += cartItem.price * cartItem.quantity
            })
            return {
                ...state,
                totalQuantity: total,
                totalPrice: totalPrice
            }
        }
        case "DELETE_FROM_CART": {
            let index = state.cart.findIndex(cartItem => cartItem.product == action.product && cartItem.brand == action.brand)
            state.cart.splice(index, 1)
            return {
                ...state,
                cart: state.cart
            }
        }
        default: return state
    }
}

export default reducer
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonBackButton,
    IonButtons,
    IonToast,
    getPlatforms
} from '@ionic/react';
import React from 'react';
import { connect } from "react-redux"
import Geocode from "react-geocode"
import { Route } from 'react-router-dom';
import Order from '../components/Order';
import { isPlatform } from '@ionic/core';

class OrderSummary extends React.Component {
    state = {
        paymentMethod: "card",
        openToast: false
    }

    textAreaRef = React.createRef()

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                Geocode.fromLatLng(`${position.coords.latitude}`, `${position.coords.longitude}`).then(
                    (response) => {
                        const address = response.results[0].formatted_address;
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        this.props.updateAddress(address, location)
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            },
            () => null
        );
    }

    render() {
        console.log(this.props.cart);
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/home" />
                        </IonButtons>
                        <IonTitle>The Flower Store</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <h4>Delivering to: {this.props.address}</h4>
                            </IonCol>
                        </IonRow>
                        <IonButton expand="block" routerLink="/map" fill="outline" routerDirection="forward">Change Location</IonButton>
                        <IonGrid>
                            <IonRow>
                                {                                    
                                    this.props.cart.map((cartItem, i) => (
                                        <IonCol size={getPlatforms()[0] == "android" || getPlatforms()[0] == "iphone" ? 12 : 3} key={i}>                                            
                                            <Order
                                            imageUrl={cartItem.imageUrl}
                                            brand={cartItem.brand}
                                            quantity={cartItem.quantity}
                                            price={cartItem.price}
                                            deleteFromCart={this.props.deleteFromCart}
                                            product={cartItem.product}
                                            index={i}
                                            />
                                        </IonCol>
                                    ))
                                }
                            </IonRow>
                        </IonGrid>
                        <div style={{ marginLeft: "5px" }}>
                            <h6>Delivery Fee: $300</h6>
                            <b>Total: ${this.props.totalPrice}</b>
                        </div>
                        <br />
                        <IonRadioGroup value={this.state.paymentMethod} onIonChange={e => this.setState({ paymentMethod: e.detail.value })}>
                            <IonItem>
                                <IonLabel>Pay with credit/debit card</IonLabel>
                                <IonRadio slot="start" value="card" />
                            </IonItem>
                            <IonItem>
                                <IonLabel>Pay cash on delivery</IonLabel>
                                <IonRadio slot="start" value="cash" />
                            </IonItem>
                        </IonRadioGroup>
                        <br />
                        <textarea ref={this.textAreaRef} style={{ width: "100%", backgroundColor: "white", height: "5rem" }} placeholder="Note to delivery agent e.g. Apartment number, leave at the door, I have a dog etc."></textarea>
                        <Route render={({ history }) => (
                            <IonButton expand="block" onClick={() => { this.setState({ openToast: true }); history.push("/home"); }}>PLACE ORDER</IonButton>
                        )}>
                        </Route>
                    </IonGrid>
                    <IonToast
                        isOpen={this.state.openToast}
                        onDidDismiss={() => this.setState({ openToast: false })}
                        message="Order has been placed!"
                        duration={2000}
                        color="primary"
                        position="bottom"
                    />
                </IonContent>
            </IonPage >
        );
    }
};

const mapStateToProps = (state) => (
    {
        quantity: state.quantity,
        address: state.address,
        cart: state.cart,
        totalPrice: state.totalPrice,
        location: state.location
    }
)

const mapDispatchToProps = dispatch => {
    return {
        updateAddress: (address, location) => dispatch({ type: "UPDATEADDRESS", address: address, location: location }),
        deleteFromCart: (brand, product, index) => {
            dispatch({ type: "DELETE_FROM_CART", brand: brand, product: product, index: index })
            dispatch({ type: "UPDATE_TOTAL_QUANTITY" })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);

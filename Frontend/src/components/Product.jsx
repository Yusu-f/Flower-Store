import React from "react";
import { Route } from 'react-router-dom';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonInput,
    IonItem, IonLabel,
    IonRow,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import { connect } from 'react-redux';


class Product extends React.Component {
    state = {       
        brand: "Real",
        orderBtnClicked: false,
        totalQuantity: 1
    }

    updateLocalQuantity = (number) => {
        this.setState(prevState => {
            if (prevState.totalQuantity + number > 0) return { totalQuantity: prevState.totalQuantity + number }
            else {
                return prevState
            }
        })
    }

    render() {
        return (
            <IonCard>
                <img src={this.props.imageUrl} width="100%" height="300" style={{ backgroundColor: "var(--ion-color-primary)" }} />
                <IonCardHeader>
                    <IonCardSubtitle>{`${this.props.productName}`}</IonCardSubtitle>
                    <IonCardTitle><b>{`$${this.props.price}`}</b></IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    {this.props.description}
                    <div style={{ display: this.state.orderBtnClicked ? "block" : "none" }}>
                        <br></br>

                        <IonItem>
                            <IonLabel>Type</IonLabel>
                            <IonSelect interface="popover" value={this.state.brand} onIonChange={e => { this.setState({ brand: e.detail.value }); }}>
                                {this.props.brands.map((brand, i) => <IonSelectOption value={`${brand}`} key={i}>{`${brand}`}</IonSelectOption>)}
                            </IonSelect>
                        </IonItem>

                        <br></br>
                        <h3>Quantity: {this.state.totalQuantity}</h3>

                        <IonGrid>
                            <IonRow>                                    
                                <IonCol offset="2" size="2">
                                    <IonButton onClick={() => { this.props.updateQuantity(-1); this.updateLocalQuantity(-1) }}>-</IonButton>
                                </IonCol>
                                <IonCol size="4">
                                    <IonInput type="number" className="ion-text-center" value={this.state.totalQuantity}></IonInput>
                                </IonCol>
                                <IonCol size="2">
                                    <IonButton onClick={() => { this.props.updateQuantity(1); this.updateLocalQuantity(1) }}>+</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                    <div style={{ display: this.state.orderBtnClicked ? "none" : "block" }}>
                        <br></br>
                    </div>
                    <IonButton expand="block" style={{ display: this.state.orderBtnClicked ? "none" : "block" }} onClick={() => { this.setState({ orderBtnClicked: true }); setTimeout(() => this.setState({ orderBtnClicked: false }), 30000); }}>ORDER</IonButton>
                    <Route render={({ history }) => (
                        <IonButton
                            expand="block"
                            style={{ display: this.state.orderBtnClicked ? "block" : "none" }}
                            onClick={() => { this.props.addToCart(this.state.totalQuantity, this.state.brand, this.props.price, this.props.productName, this.props.imageUrl); if(this.props.cart.length == 0) history.push("/ordersummary")}}
                        >ADD TO CART
                        </IonButton>
                    )
                    }>
                    </Route>
                </IonCardContent>
            </IonCard>
        )
    }
}

const mapStateToProps = (state) => (
    {
        quantity: state.quantity,
        brands: state.brands,
        totalQuantity: state.totalQuantity,
        cart: state.cart
    }
)

const mapDispatchToProps = dispatch => {
    return {
        changeBrand: (brand) => dispatch({ type: "CHANGE_BRAND", brand: brand }),
        updateQuantity: (number) => dispatch({ type: "UPDATE_QUANTITY", number: number }),
        addToCart: (quantity, brand, price, product, imageUrl) => {
            dispatch({ type: "ADD_TO_CART", quantity: quantity, brand: brand, price: price, product: product, imageUrl: imageUrl })
            dispatch({ type: "UPDATE_TOTAL_QUANTITY" })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, isPlatform, IonRow, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonAlert, getPlatforms } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import { cart } from "ionicons/icons"
import { Route } from 'react-router-dom';
import Product from '../components/Product';
import ProductData from '../store/data/ProductData';

class Home extends React.Component {
    state = {
        orderBtnClicked: false,
        totalQuantity: 0
    }

    orderBtnClicked = () => {      
        this.setState({ orderBtnClicked: true })
    }

    helpMessage = `
    <p>Beautiful flowers of any kind, delivered straight to your doorstep!!</p>    
    Built by <a href="https://www.upwork.com/freelancers/~0169279f54871908fd">me</a>
  `

    render() {
        console.log(isPlatform("desktop"));
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false} menu={"first"} color="medium"></IonMenuButton>
                        </IonButtons>
                        <IonTitle className="ion-text-center">The Flower store</IonTitle>
                        <Route render={({ history }) => (
                            <div slot="end" style={{ marginRight: "20px", color: "var(--ion-color-primary)", cursor: "pointer" }} onClick={() => history.push("/ordersummary")}>
                                <IonIcon icon={cart} />
                                <span style={{ marginLeft: "5px" }}>{
                                    this.props.totalQuantity
                                }</span>
                            </div>
                        )}>
                        </Route>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonGrid>
                        <IonRow>
                            {ProductData.map((product, i) => (
                                <IonCol size={getPlatforms()[0] == "android" || getPlatforms()[0] == "iphone" ? 12 : 3} key={i}>
                                    <Product
                                        productName={product.productName}
                                        price={product.price}
                                        description={product.description}
                                        imageUrl={product.imageUrl}
                                    />
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                    <IonAlert
                        isOpen={this.props.showHelp}
                        onDidDismiss={() => this.props.setShowHelp(false)}
                        header={'About'}
                        message={this.helpMessage}
                        cssClass='my-custom-class'
                    />
                </IonContent>
            </IonPage>
        );
    }
};

const mapStateToProps = (state) => (
    {
        quantity: state.quantity,
        brand: state.brand,
        totalQuantity: state.totalQuantity
    }
)

const mapDispatchToProps = dispatch => {
    return {
        changeBrand: (brand) => dispatch({ type: "CHANGE_BRAND", brand: brand }),
        updateQuantity: (number) => dispatch({ type: "UPDATE_QUANTITY", number: number }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
} from '@ionic/react';

const Order = ({imageUrl, brand, quantity, price, deleteFromCart, product, index}) => {
    return (
        <IonCard style={{ marginLeft: "5px", marginRight: "5px" }}>
            <img src={imageUrl} width="100%" height="300" style={{ backgroundColor: "var(--ion-color-primary)" }} />
            <IonCardHeader>
                <IonCardTitle><b>{product}</b></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                Quantity: {quantity}
                <br />
                Price: ${price}
                <br />
                Type: {brand}
                <br />
                <br />
                <IonButton color="danger" expand="block" onClick={() => deleteFromCart(brand, product, index)}>DELETE</IonButton>
            </IonCardContent>
        </IonCard>
    )
}

export default Order
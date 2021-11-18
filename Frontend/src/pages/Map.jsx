import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Map from "../components/Map"

class MapPage extends React.Component {
    render() {
        return (
            <IonPage>                
                <IonContent fullscreen>
                   <Map /> 
                </IonContent>
            </IonPage >
        );
    }
};

export default (MapPage);

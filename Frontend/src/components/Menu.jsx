import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { help } from 'ionicons/icons';
import { useRef } from 'react';


const Menu = ({ setShowHelp }) => {
  const menuRef = useRef() 
  
  return (
    <IonMenu side="start" menuId="first" disabled={false} type="overlay" contentId="main" ref={menuRef}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button lines="none" onClick={() => { setShowHelp(true); menuRef.current.close(); } }>
            <IonIcon icon={help} slot="start"></IonIcon>
            <IonLabel>About</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu
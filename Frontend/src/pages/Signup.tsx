import { IonContent, IonPage } from '@ionic/react';
import SignUpForm from '../components/SignUpForm.jsx';

const Signup: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <SignUpForm />
      </IonContent>
    </IonPage>
  );
};

export default Signup;

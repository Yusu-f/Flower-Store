import { IonContent, IonPage } from '@ionic/react';
import LoginForm from '../components/loginform.jsx';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <LoginForm />
      </IonContent>
    </IonPage>
  );
};

export default Login;

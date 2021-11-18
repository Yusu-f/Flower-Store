import { Redirect, Route } from 'react-router-dom';
import { IonAlert, IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import Home from './pages/Home.jsx';
import OrderSummary from './pages/OrderSummary.jsx';
import MapPage from './pages/Map';
import { useState, useEffect } from "react"
import PWAPrompt from 'react-ios-pwa-prompt'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Menu from './components/Menu.jsx';

let deferredPrompt

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('INSTALL: Success');
    });
  }, []);

  const handleInstallClick = () => {
    // Hide the app provided install promotion
    setInstallable(false);
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };
  
  return (
    <IonApp>
      <Menu setShowHelp={setShowHelp} />
      {<IonAlert
        isOpen={installable}
        message={'Add to home screen?'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: blah => {
              console.log("canceled");
            }
          },
          {
            text: 'Okay',
            handler: blah => {
              handleInstallClick()
            }
          }
        ]}
      />}
      {
        isPlatform("ios") ? <PWAPrompt debug={true} /> : null
      }
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>
          <Route exact path="/home">
            <Home showHelp={showHelp} setShowHelp={setShowHelp} />
          </Route>
          <Route exact path="/map">
            <MapPage />
          </Route>
          <Route exact path="/ordersummary">
            <OrderSummary />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;

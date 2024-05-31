import '../styles/global.css';
import '../styles/Home.module.css';
import { WalletProvider } from '@suiet/wallet-kit';
import Header from '../components/Header';
import { useState } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-tooltip/dist/react-tooltip.css";

function MyApp ( { Component, pageProps } ) {
  const [ isSignUp, setIsSignUp ] = useState( false );
  const [ isLogIn, setIsLogIn ] = useState( false );
  return (
    <div className='container mx-auto'>
      <ToastContainer />
      <WalletProvider  >
        <Header setIsLogIn={setIsLogIn} />
        <Component {...pageProps} />
        {
          isSignUp && <SignUp setIsLogIn={setIsLogIn} setIsSignUp={setIsSignUp} />
        }

        {
          isLogIn && <LogIn setIsLogIn={setIsLogIn} setIsSignUp={setIsSignUp} />
        }
      </WalletProvider>
    </div>
  );
}

export default MyApp;

import { useEffect, useRef } from "react";
import { ConnectButton } from "@suiet/wallet-kit";
import bg from "../assets/images/paper_background.jpg";

const LogIn = ( { setIsLogIn, setIsSignUp } ) => {
  const wrapperRef = useRef( null );
  const openConnectModal = useRef( false );
  useEffect( () => {
    function handleClickOutside ( event ) {
      if ( !openConnectModal.current ) {
        if ( wrapperRef.current && !wrapperRef.current.contains( event.target ) ) {
          setIsLogIn( false );
          openConnectModal.current = false;
        }
      }
    }
    document.addEventListener( "mousedown", handleClickOutside );
    return () => {
      document.removeEventListener( "mousedown", handleClickOutside );
    };
  }, [ setIsLogIn, wrapperRef ] );

  const handleSignUp = () => {
    setIsLogIn( false );
    setIsSignUp( true );
  };

  const handleOpenConnectModal = () => {
    openConnectModal.current = true;
  };
  return (
    <section className="bg-gray-600/40 w-screen h-screen fixed top-0 left-0">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div
          className="w-full bg-white shadow md:mt-0 sm:max-w-md xl:p-0"
          ref={wrapperRef}
          style={{ backgroundImage: `url(${ bg.src })` }}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign In
            </h1>
            <p className="text-sm font-light">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4 decoration-dotted"
                onClick={handleSignUp}
              >
                Sign Up
              </a>
            </p>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5"
                  placeholder="john@gmail.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5"
                  required=""
                />
              </div>
              <button
                type="submit"
                className="hover:underline underline=offset-4 hover:decoration-dotted w-full bg-primary-600 hover:bg-primary-700 focus:outline-none font-semibold px-5 py-2.5 text-center"
              >
                Sign In
              </button>
            </form>
            <div className="justify-center text-center">
              <p className="m-3">Or</p>
              <div onClick={handleOpenConnectModal}>
                <ConnectButton
                  onConnectError={() => ( openConnectModal.current = false )}
                  onConnectSuccess={() => { openConnectModal.current = false; setIsLogIn( false ); }}
                >Connect Wallet</ConnectButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogIn;

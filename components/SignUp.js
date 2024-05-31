import { ConnectButton } from "@suiet/wallet-kit";
import { useEffect, useRef } from "react";
import bg from "../assets/images/paper_background.jpg";

const SignUp = ( { setIsSignUp, setIsLogIn } ) => {
  const wrapperRef = useRef( null );
  const openConnectModal = useRef( false );
  useEffect( () => {
    function handleClickOutside ( event ) {
      console.log( !openConnectModal.current );
      if ( !openConnectModal.current ) {
        if ( wrapperRef.current && !wrapperRef.current.contains( event.target ) ) {
          setIsSignUp( false );
          openConnectModal.current = false;
        }
      }
    }
    document.addEventListener( "mousedown", handleClickOutside );
    return () => {
      document.removeEventListener( "mousedown", handleClickOutside );
    };
  }, [ setIsSignUp, wrapperRef ] );

  const handleLogIn = () => {
    setIsSignUp( false );
    setIsLogIn( true );
  };

  const handleOpenConnectModal = () => {
    openConnectModal.current = true;
  };
  return (
    <section className="bg-gray-400/40 w-screen h-screen fixed top-0 left-0">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div
          className="w-full bg-white shadow md:mt-0 sm:max-w-md xl:p-0"
          ref={wrapperRef}
          style={{ backgroundImage: `url(${ bg.src })` }}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Register
            </h1>
            <p className="text-sm font-light">
              Already have an account?{" "}
              <a
                href="#"
                className="underline underline-offset-4 decoration-dotted"
                onClick={handleLogIn}
              >
                Login
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-primary-600 block w-full p-2.5"
                  placeholder="john@gmail.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="displayname"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Display Name
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    className="inline relative cursor-pointer ml-1"
                    width="16px"
                    height="16px"
                  >
                    <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z" />
                  </svg>
                  <div
                    id="tooltip-default"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
                  >
                    This is a public name to identify you as an author on poems.
                    It is not used for login
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </label>
                <input
                  type="text"
                  name="displayname"
                  id="password"
                  placeholder="John"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-primary-600 block w-full p-2.5"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-primary-600 block w-full p-2.5"
                  required=""
                />
              </div>
              <button
                type="submit"
                className="hover:underline underline=offset-4 hover:decoration-dotted w-full bg-primary-600 hover:bg-primary-700 focus:outline-none font-semibold px-5 py-2.5 text-center"
              >
                Create My Account
              </button>
            </form>
            <div className="justify-center text-center">
              <p className="m-3">Or Continue With</p>
              <div onClick={handleOpenConnectModal}>
                <ConnectButton
                  onConnectError={() => ( openConnectModal.current = false )}
                  onConnectSuccess={() => { openConnectModal.current = false; setIsSignUp( false ); }}
                >Connect Wallet</ConnectButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;

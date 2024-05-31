import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import bg from '../assets/images/paper_background.jpg';
import CommonButton from './CommonButton';
import { sentanceToWords, sleep } from '../utils/sui';
import { useWallet } from '@suiet/wallet-kit';
import { toast } from 'react-toastify';
import { month } from '../utils/ipfs';
import { Tooltip as ReactTooltip } from "react-tooltip";

const PoemModal = ( { title, createdAt, background, image, words, setShowPoem, poemId, update } ) => {
  const wallet = useWallet();
  const wrapperRef = useRef( null );
  const [ isLoading, setIsLoading ] = useState( false );
  const handleDeletePoem = async () => {
    if ( !wallet.connected ) {
      toast( "Please connect your wallet.", { type: 'warning' } );
      return;
    }
    setIsLoading( true );
    const success = await sentanceToWords( wallet, poemId );
    if ( success ) {
      toast( "Successfully Deleted", { type: 'success' } );
      update( poemId );
      setShowPoem( false );
    }
    else
      toast( "Something went wrong.", { type: 'error' } );
    setIsLoading( false );
  };
  useEffect( () => {
    function handleClickOutside ( event ) {
      if ( wrapperRef.current && !wrapperRef.current.contains( event.target ) ) {
        setShowPoem( false );
      }
    }
    document.addEventListener( "mousedown", handleClickOutside );
    return () => {
      document.removeEventListener( "mousedown", handleClickOutside );
    };
  }, [ wrapperRef ] );

  const downloadImage = () => {
    fetch( image, {
      method: "GET",
      headers: {}
    } )
      .then( response => {
        response.arrayBuffer().then( function ( buffer ) {
          const url = window.URL.createObjectURL( new Blob( [ buffer ] ) );
          const link = document.createElement( "a" );
          link.href = url;
          link.setAttribute( "download", `${ title }.png` ); //or any other extension
          document.body.appendChild( link );
          link.click();
        } );
      } )
      .catch( err => {
        console.log( err );
      } );
  };
  return (
    <section className="bg-gray-600/40 w-full fixed top-0 left-0" style={{ zIndex: 99 }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full lg:w-4/5 shadow md:mt-0 xl:p-0 relative" ref={wrapperRef} style={{ backgroundImage: `url(${ bg.src })` }}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 grid p-4 mx-auto gap-4 md:grid-cols-12">
            <div className="mx-auto md:col-span-6 w-full">
              <Image priority alt="Picture" src={image} width={720} height={720} className='w-full border border-gray-400' />
            </div>
            <div className='mx-auto md:col-span-6 w-full text-left'>
              <p className="font-light sm:text-xl">TITLE: {title}</p>
              <p className="font-light sm:text-xl">CREATED: {month[ ( new Date( createdAt ).getMonth() ) ]} {new Date( createdAt ).getDate()}, {new Date( createdAt ).getFullYear()}</p>
              <p className="font-light sm:text-xl">BACKGROUND: {background}</p>
              <p className="font-light sm:text-xl">WORDS USED: {words}</p>
            </div>
            <button onClick={() => setShowPoem( false )} className='absolute top-3 right-4 bg-white rounded-full p-2 inline-flex items-center justify-center hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className="sr-only">Close menu</span>
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4 md:space-y-6 grid p-4 mx-auto gap-4 md:grid-cols-12">
            <div className="flex mx-auto md:col-span-6 w-full p-2">
              <CommonButton
                isLoading={isLoading}
                onClick={handleDeletePoem}
                className={"md:col-span-4 hover:bg-red-600/40 hover:text-white text-red-600 border border-red-600 hover:border-black uppercase text-xl px-3 py-1.5 text-center h-fit min-w-fit m-2"}>
                Delete Poem
              </CommonButton>
              <p className="font-light text-sm text-left">Deleting a poem breaks apart the group, but you will still keep the individual words. You can always regroup them for a new poem.</p>
            </div>
            <div className="mx-auto md:col-span-6 w-full p-2 md:absolute md:bottom-0 md:right-4" style={{ width: "auto" }}>
              {/* <h1 className='uppercase text-3xl'>Share your Poem</h1> */}
              <div className='flex mt-4 gap-4'>
                <svg id='download-cursor' className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="-4 -4 32 32" onClick={downloadImage}><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z" /></svg>
                <ReactTooltip anchorId='download-cursor' place='top' content='Download Poem' />
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" /></svg>
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fillRule="evenodd" clipRule="evenodd"><path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.248 18.348l-.371-1.295.896.833.847.784 1.505 1.33v-12.558c0-.798-.644-1.442-1.435-1.442h-9.38c-.791 0-1.435.644-1.435 1.442v9.464c0 .798.644 1.442 1.435 1.442h7.938zm-1.26-3.206l-.462-.567c.917-.259 1.267-.833 1.267-.833-.287.189-.56.322-.805.413-.35.147-.686.245-1.015.301-.672.126-1.288.091-1.813-.007-.399-.077-.742-.189-1.029-.301-.161-.063-.336-.14-.511-.238l-.028-.016-.007-.003-.028-.016-.028-.021-.196-.119s.336.56 1.225.826l-.469.581c-1.547-.049-2.135-1.064-2.135-1.064 0-2.254 1.008-4.081 1.008-4.081 1.008-.756 1.967-.735 1.967-.735l.07.084c-1.26.364-1.841.917-1.841.917l.413-.203c.749-.329 1.344-.42 1.589-.441l.119-.014c.427-.056.91-.07 1.414-.014.665.077 1.379.273 2.107.672 0 0-.553-.525-1.743-.889l.098-.112s.959-.021 1.967.735c0 0 1.008 1.827 1.008 4.081 0 0-.573.977-2.142 1.064zm-.7-3.269c-.399 0-.714.35-.714.777 0 .427.322.777.714.777.399 0 .714-.35.714-.777 0-.427-.315-.777-.714-.777zm-2.555 0c-.399 0-.714.35-.714.777 0 .427.322.777.714.777.399 0 .714-.35.714-.777.007-.427-.315-.777-.714-.777z" /></svg> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoemModal;
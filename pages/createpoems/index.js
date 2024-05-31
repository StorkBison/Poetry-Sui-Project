import Image from "next/image";
import Blank from "../../assets/images/Blank.jpg";
import Forest from "../../assets/images/forest.png";
import Refrigerator from "../../assets/images/Refrigerator.png";
import Whiteboard from "../../assets/images/whiteboard.png";
import { useState, useEffect, useRef } from "react";
import SaveModal from "../../components/saveModal";
import $ from "jquery";
import { getAllSentences, load, sleep } from "../../utils/sui";
import { useWallet } from "@suiet/wallet-kit";
import Draggable from "react-draggable";
import bg from '../../assets/images/paper_background.jpg';
import { Transition } from "@tailwindui/react";

const pageSize = 100;
const createpoems = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sideBarRef = useRef( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallet = useWallet();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ selectedBg, setSelectedBG ] = useState( "blank" );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ showUsedWord, setShowUsedWord ] = useState( false );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ showSaveModal, setShowSaveModal ] = useState( false );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ showSideBar, setShowSideBar ] = useState( false );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ words, setWords ] = useState( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ updatedWords, setUpdatedWords ] = useState( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ usedWords, setUsedWords ] = useState( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ searchWord, setSearchWord ] = useState( "" );

  const handleChangeSearchWord = ( e ) => {
    setSearchWord( e.target.value );
  };
  const handleCombineAndSave = () => {
    setShowSaveModal( true );
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ windowsPos, setWindowsPos ] = useState( 0 );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ page, setPage ] = useState( 0 );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    if ( windowsPos.x === undefined || windowsPos.x !== $( ".imageShow" ).width() )
      setWindowsPos( {
        x: $( ".imageShow" ).width(),
        y: $( ".imageShow" ).height(),
      } );
    const handleResize = () => {
      setWindowsPos( {
        x: $( ".imageShow" ).width(),
        y: $( ".imageShow" ).height(),
      } );
    };
    window.addEventListener( 'load', handleResize, false );
    window.addEventListener( "resize", handleResize, false );
    return () => window.removeEventListener( "resize", handleResize, false );
  } );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    if ( wallet.connected )
      ( async () => {
        sleep( 1000 );
        const object = await load( wallet );
        const objectPos = object.map( ( item, index ) => ( {
          index: index,
          word: item?.data?.display?.data?.word,
          objectId: item?.data?.objectId,
          used: false,
          x: 0, y: 0, startX: 0, startY: 0,
        } ) );
        const mySentences = await getAllSentences( wallet );
        let usedWordsInSentences = [];
        if ( mySentences !== [] ) {
          for ( var i = 0; i < mySentences.length; i++ ) {
            usedWordsInSentences = [ ...usedWordsInSentences, ...mySentences[ i ].data.content.fields.words ];
          }
        }
        let used = usedWordsInSentences.map( ( item ) => ( { word: item, used: true, x: 0, y: 0, startX: 0, startY: 0, } ) );
        setUsedWords( [ ...used ] );
        const arrayO = [ ...objectPos ];
        setWords( [ ...arrayO ] );
        setUpdatedWords( [ ...arrayO ] );
      } )();
  }, [ wallet ] );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    if ( words !== null ) {
      const newO = words.filter(
        ( item ) =>
          item.word.search( searchWord ) >= 0
      );
      let used = [];
      if ( showUsedWord ) {
        used = usedWords.filter( ( item ) => item.word.search( searchWord ) >= 0 );
      }
      let sorted = [ ...newO, ...used ];

      sorted.sort( ( a, b ) => {
        if ( a.word < b.word ) return -1;
        else if ( a.word > b.word ) return 1;
        return 0;
      } );
      setUpdatedWords( [ ...sorted ] );
    }
  }, [ searchWord, words, showUsedWord, usedWords ] );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    function handleClickOutside ( event ) {
      if ( sideBarRef.current && !sideBarRef.current.contains( event.target ) ) {
        setShowSideBar( false );
      }
    }
    document.addEventListener( "mousedown", handleClickOutside );
    return () => {
      document.removeEventListener( "mousedown", handleClickOutside );
    };
  }, [ sideBarRef ] );
  return (
    <div className="text-center w-full">
      <h1 className="mb-4 text-4xl lg:text-6xl tracking-tight">Create Poems</h1>
      <div className="flex p-4 mx-auto relative">
        <div className="lg:hidden">
          <button onClick={() => { setShowSideBar( true ); }} type="button" className="items-center p-2 ml-3 text-sm text-neutral-900 xl:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open Setting menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <Transition show={showSideBar} className="bg-gray-600/40 w-full h-full absolute top-0 left-0" style={{ zIndex: 9999 }}>
          <Transition.Child enter="transition ease-linear duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-linear duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full" className="h-full">
            <div className="text-left h-full p-4 relative transition-transform" ref={sideBarRef} style={{ minWidth: '280px', maxWidth: '280px', backgroundImage: `url(${ bg.src })` }}>
              <button onClick={() => { setShowSideBar( false ); }} type="button" className="absolute right-0 top-0 inline-flex items-center p-2 ml-3 text-sm text-neutral-900 xl:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open Setting menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              </button>
              <h1 className="mb-4 text-2xl md:text-4xl tracking-tight">
                BACKGROUND
              </h1>
              <div className="flex items-center">
                <input
                  checked={selectedBg === "blank"}
                  id="sidebar-radio-1"
                  type="radio"
                  value="blank"
                  name="sidebar-radio"
                  className="w-4 h-4 border-gray-300 focus:ring-gray-500"
                  onChange={() => {
                    setSelectedBG( "blank" );
                  }}
                />
                <label
                  htmlFor="sidebar-radio-1"
                  className="ml-2 text-lg font-medium"
                >
                  Blank Page
                </label>
              </div>
              <div className="flex items-center">
                <input
                  checked={selectedBg === "whiteboard"}
                  id="sidebar-radio-2"
                  type="radio"
                  value="whiteboard"
                  name="sidebar-radio"
                  className="w-4 h-4 border-gray-300 focus:ring-gray-500"
                  onChange={() => {
                    setSelectedBG( "whiteboard" );
                  }}
                />
                <label
                  htmlFor="sidebar-radio-2"
                  className="ml-2 text-lg font-medium"
                >
                  Whiteboard
                </label>
              </div>
              <div className="flex items-center">
                <input
                  checked={selectedBg === "refrigerator"}
                  id="sidebar-radio-3"
                  type="radio"
                  value="refrigerator"
                  name="sidebar-radio"
                  className="w-4 h-4 border-gray-300 focus:ring-gray-500"
                  onChange={() => {
                    setSelectedBG( "refrigerator" );
                  }}
                />
                <label
                  htmlFor="sidebar-radio-3"
                  className="ml-2 text-lg font-medium"
                >
                  Refrigerator
                </label>
              </div>
              <div className="flex items-center">
                <input
                  checked={selectedBg === "forest"}
                  id="sidebar-radio-4"
                  type="radio"
                  value="forest"
                  name="sidebar-radio"
                  className="w-4 h-4 border-gray-300 focus:ring-gray-500"
                  onChange={() => {
                    setSelectedBG( "forest" );
                  }}
                />
                <label
                  htmlFor="sidebar-radio-4"
                  className="ml-2 text-lg font-medium"
                >
                  Forest
                </label>
              </div>
              <div className="mt-6">
                <button
                  className="hover:bg-red-600/40 bg-white hover:text-white border border-black border-b-2 border-r-2 hover:border-black uppercase text-2xl px-2 py-1 text-center"
                  onClick={() => { setShowSideBar( false ); handleCombineAndSave(); }}
                >
                  Combine and Save
                </button>
              </div>
            </div>
          </Transition.Child>


        </Transition>

        <div className={`mx-auto text-left relative hidden lg:block`} style={{ minWidth: '280px', maxWidth: '280px' }}>
          <h1 className="mb-4 text-2xl md:text-4xl tracking-tight">
            BACKGROUND
          </h1>
          <div className="flex items-center">
            <input
              checked={selectedBg === "blank"}
              id="default-radio-1"
              type="radio"
              value="blank"
              name="default-radio"
              className="w-4 h-4 border-gray-300 focus:ring-gray-500"
              onChange={() => {
                setSelectedBG( "blank" );
              }}
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-lg font-medium"
            >
              Blank Page
            </label>
          </div>
          <div className="flex items-center">
            <input
              checked={selectedBg === "whiteboard"}
              id="default-radio-2"
              type="radio"
              value="whiteboard"
              name="default-radio"
              className="w-4 h-4 border-gray-300 focus:ring-gray-500"
              onChange={() => {
                setSelectedBG( "whiteboard" );
              }}
            />
            <label
              htmlFor="default-radio-2"
              className="ml-2 text-lg font-medium"
            >
              Whiteboard
            </label>
          </div>
          <div className="flex items-center">
            <input
              checked={selectedBg === "refrigerator"}
              id="default-radio-3"
              type="radio"
              value="refrigerator"
              name="default-radio"
              className="w-4 h-4 border-gray-300 focus:ring-gray-500"
              onChange={() => {
                setSelectedBG( "refrigerator" );
              }}
            />
            <label
              htmlFor="default-radio-3"
              className="ml-2 text-lg font-medium"
            >
              Refrigerator
            </label>
          </div>
          <div className="flex items-center">
            <input
              checked={selectedBg === "forest"}
              id="default-radio-4"
              type="radio"
              value="forest"
              name="default-radio"
              className="w-4 h-4 border-gray-300 focus:ring-gray-500"
              onChange={() => {
                setSelectedBG( "forest" );
              }}
            />
            <label
              htmlFor="default-radio-4"
              className="ml-2 text-lg font-medium"
            >
              Forest
            </label>
          </div>
          <div className="mt-6">
            <button
              className="hover:bg-[#4abd6a]  bg-white hover:text-white border border-black border-b-2 border-r-2 hover:border-black uppercase text-2xl px-2 py-1 text-center"
              onClick={handleCombineAndSave}
            >
              Combine and Save
            </button>
          </div>
        </div>
        <div className="mx-auto p-2 text-left relative">
          <div className="w-full">
            <Image
              id="droppableDiv"
              priority
              alt="Picture"
              src={
                selectedBg === "blank"
                  ? Blank
                  : selectedBg === "refrigerator"
                    ? Refrigerator
                    : selectedBg === "forest"
                      ? Forest
                      : Whiteboard
              }
              className="w-full border border-black imageShow border-b-2 border-r-2"
            />
          </div>
          <p className="font-light text-xl my-4">
            Drag, drop, place your words; fly, soar, ideas as birds
          </p>
          <div className="flex sm:flex-row flex-col gap-4">
            <input
              type="text"
              name="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5"
              placeholder="Search for words..."
              required=""
              value={searchWord}
              onChange={handleChangeSearchWord}
            />
            <div className="flex items-center">
              <input
                checked={showUsedWord}
                id="checked-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-lg text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                onChange={() => setShowUsedWord( !showUsedWord )}
              />
              <label
                htmlFor="checked-checkbox"
                className="ml-2 text-lg font-medium text-gray-900"
              >
                Show my words used in other poems
              </label>
            </div>
          </div>
          <div className="flex flex-row flex-wrap">
            {updatedWords !== null &&
              updatedWords.map( ( item, index ) => {
                if ( ( index >= page * pageSize && index < ( page + 1 ) * pageSize ) || ( item.x !== 0 && item.y !== 0 ) )
                  if ( !item.used )
                    return (
                      <Draggable
                        defaultPosition={{ x: item.x === 0 && item.y === 0 ? 0 : item.x, y: item.x === 0 && item.y === 0 ? 0 : item.y }}
                        key={index}
                        onStart={() => {
                          if ( item.startX === 0 && item.startY === 0 ) {
                            item.startX = $( `.${ item.word.split( " " )[ 0 ] }-${ index }` ).position().left;
                            item.startY = $( `.${ item.word.split( " " )[ 0 ] }-${ index }` ).position().top;
                          }
                        }}
                        onStop={( e, d ) => {
                          item.x = $( `.${ item.word.split( " " )[ 0 ] }-${ index }` ).position().left;
                          item.y = $( `.${ item.word.split( " " )[ 0 ] }-${ index }` ).position().top;
                        }}
                      >
                        <div
                          className={`${ item.word.split( " " )[ 0 ] }-${ index } ${ ( item.x !== 0 && item.y !== 0 ) ? "absolute " : "" }cursor-move border border-black border-b-2 border-r-2 p-1 bg-white w-fit font-semibold m-1`}
                          style={{ left: item.x === 0 && item.y === 0 ? null : item.startX, top: item.x === 0 && item.y === 0 ? null : item.startY, fontFamily: "Courier New" }}
                        >
                          {item.word}
                        </div>
                      </Draggable>
                    );
                  else return (
                    <div className={`cursor-pointer border border-black border-b-2 border-r-2 p-1 bg-gray-300 w-fit font-semibold m-1`} style={{ fontFamily: "Courier New" }}>
                      {item.word}
                    </div>
                  );
              } )}
            {
              ( ( words === null || words.length === 0 ) && ( usedWords === null || usedWords.length === 0 ) ) ? < p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>You don’t currently own any words</p> : ( updatedWords === null || updatedWords.length === 0 ) && < p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>You don’t have any words that match your filter criteria.</p>
            }
          </div>
          {
            updatedWords !== null && updatedWords.length > pageSize &&
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold text-gray-900">{parseInt( 1 + pageSize * page )}</span> to <span className="font-semibold text-gray-900">{( pageSize * ( page + 1 ) ) < updatedWords.length ? parseInt( pageSize * ( page + 1 ) ) : updatedWords.length}</span> of <span className="font-semibold text-gray-900">{updatedWords.length}</span> Words
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button onClick={() => {
                  if ( page > 0 ) setPage( ( page - 1 ) );
                  else setPage( parseInt( updatedWords.length / pageSize ) );
                }} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900">
                  Prev
                </button>
                <button onClick={() => {
                  if ( updatedWords.length / pageSize > page + 1 ) setPage( page + 1 );
                  else setPage( 0 );
                }} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900">
                  Next
                </button>
              </div>
            </div>
          }
        </div>
      </div>
      {showSaveModal && (
        <SaveModal
          background={selectedBg}
          setShowModal={setShowSaveModal}
          words={updatedWords}
          windowsPos={windowsPos}
        />
      )}
    </div>
  );
};

export default createpoems;

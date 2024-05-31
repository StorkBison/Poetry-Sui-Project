import { useEffect, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { getAllSentences, sleep } from '../../utils/sui';
import PoemCard from '../../components/PoemCard';

const mypoems = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wallet = useWallet();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ sentences, setSentences ] = useState( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ sortBy, setSortBy ] = useState( "none" );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ searchWord, setSearchWord ] = useState( "" );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ filteredSentence, setFilteredSentence ] = useState( null );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    if ( wallet.connected )
      getSentences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ wallet ] );

  const getSentences = async () => {
    if ( wallet.connected )
      ( async () => {
        sleep( 1000 );
        const object = await getAllSentences( wallet );
        if ( object !== [] ) {
          const sent = object.map( ( { data } ) => ( {
            objectId: data.objectId,
            background: data.display.data.background,
            description: data.display.data.description,
            imageUrl: data.display.data.image_url,
            name: data.display.data.name,
            poem: data.display.data.poem,
            title: data.display.data.title,
            author: data.display.data.author,
            createdAt: parseInt( data.content.fields.created_at ),
          } ) );
          setSentences( [ ...sent ] );
          setFilteredSentence( [ ...sent ] );
        }
      } )();
  };

  const updateSentences = ( poemId ) => {
    const filtered = sentences.filter( ( item ) => item.objectId !== poemId );
    setSentences( [ ...filtered ] );
  };

  const handleChangeSearchWord = ( e ) => {
    setSearchWord( e.target.value );
  };

  const handleChangeSelect = ( e ) => {
    setSortBy( e.target.value );
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect( () => {
    if ( sentences !== null ) {
      const filtered = sentences.filter( ( item ) => {
        const title = item.title.toLowerCase();
        const sear = searchWord.toLowerCase();
        if ( title.indexOf( sear ) !== -1 ) return 1;
        return 0;
      } );
      if ( sortBy === "title" ) {
        filtered.sort( ( a, b ) => a.title.localeCompare( b.title ) );
      }
      if ( sortBy === "dataCreated" ) {
        filtered.sort( ( a, b ) => a.createdAt - b.createdAt );
      }
      if ( sortBy === 'titledesc' ) {
        filtered.sort( ( a, b ) => b.title.localeCompare( a.title ) );
      }
      if ( sortBy === 'dataCreateddesc' ) {
        filtered.sort( ( a, b ) => b.createdAt - a.createdAt );
      }

      setFilteredSentence( [ ...filtered ] );
    }
  }, [ sortBy, searchWord, sentences ] );

  return (
    <div className="text-center w-full">
      <h1 className="mb-4 text-4xl md:text-6xl tracking-tight">My Poems</h1>
      <p className="font-light text-2xl">View your poems, split them up; free words once locked up</p>
      <div className="grid p-4 mx-auto gap-4 md:grid-cols-12 p-6 m-6">
        <div className="mx-auto md:col-span-3 w-full p-2">
          <div>
            <label htmlFor="title" className="block mb-2 text-xl font-medium text-gray-900">Title Search</label>
            <input onChange={handleChangeSearchWord} value={searchWord} type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:border-gray-600 block w-full p-2.5" placeholder="Search poems by title..." required="" />
          </div>
          <div>
            <label htmlFor="sortby" className="block mb-2 text-xl font-medium text-gray-900">Sort By</label>
            <select onChange={handleChangeSelect} defaultValue={"none"} value={sortBy} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:border-blue-500 block w-full p-2.5 ">
              <option value="none">Sort poems by...</option>
              <option value="title">Title (ASC) </option>
              <option value="titledesc">Title (DESC)</option>
              <option value="dataCreated">Data Created (ASC)</option>
              <option value="dataCreateddesc">Data Created (DESC)</option>
            </select>
          </div>
        </div>
        <div className="mx-auto md:col-span-9 w-full p-2">
          <div className="grid py-4 mx-auto gap-4 md:grid-cols-12">
            {
              filteredSentence !== null && filteredSentence.length > 0 ? filteredSentence.map( ( item, index ) => (
                <div key={index} className='mx-auto md:col-span-4 w-full p-2'>
                  <PoemCard poem={item} update={updateSentences} />
                </div>
                // eslint-disable-next-line react/no-unescaped-entities
              ) ) : <p className='mx-auto md:col-span-12 w-full p-2 text-2xl text-center'>
                {
                  searchWord !== "" ? "You don’t have any poems that match your filter criteria."
                    : "You don’t have any poems, head to the Create Poems page to write your first poem."
                }</p>
            }
            {
              !wallet.connected && <p className='text-2xl text-center mx-auto md:col-span-12 w-full p-2'>Please connect your wallet.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default mypoems;
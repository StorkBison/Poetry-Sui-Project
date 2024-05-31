import { TransactionBlock, JsonRpcProvider, devnetConnection, testnetConnection } from "@mysten/sui.js";

// const provider = new JsonRpcProvider( devnetConnection )
// const PACKAGE = "0xda8a583c879118b3a833dcbe7da3332321aed00ac1363116f79b6500eb84ab9b";
// const WordsDataObject = "0xa266c5fe9165eada54dd883cec7f38eb003509feb0d375a59a73b9a6ff1963ab";

const provider = new JsonRpcProvider( testnetConnection );
const PACKAGE = "0x70f2ed090543e52962a12c905361ecc661ad0dcf729335a9108453dd2ada76d3";
const WordsDataObject = "0x9e3247de27941062c8293a2d1cbe447617460fd75c4f01c3719c54219cc60bd5";

export const sleep = ms => new Promise( r => setTimeout( r, ms ) );

export const getAllSentences = async ( wallet, ) => {
  try {
    let objects_sentences = await provider.getOwnedObjects( {
      owner: wallet?.address,
      options: {
        showDisplay: true,
        showContent: true,
      },
      filter: {
        StructType: PACKAGE + "::words2words::Sentence"
      }
    } );
    return [ ...objects_sentences.data ];
  } catch ( e ) {
    console.log( e );
    return [];
  }
};
const getAllObjects = async ( wallet, cursor ) => {
  try {
    const objectsWords = await provider.getOwnedObjects( {
      owner: wallet?.address,
      cursor: cursor === "" ? null : cursor,
      options: {
        showDisplay: true
      },
      filter: {
        StructType: PACKAGE + "::words2words::Word"
      }
    } );
    if ( objectsWords.hasNextPage ) {
      const next = await getAllObjects( wallet, objectsWords.nextCursor );
      return [ ...objectsWords.data, ...next ];
    } else return [ ...objectsWords.data ];
  } catch ( e ) {
    console.log( e );
    return [];
  }
};

const getChangedObjects = async ( wallet, object ) => {
  const objectIds = object.map( ( item ) => ( item.reference.objectId ) );
  try {
    if ( objectIds.length > 50 ) {
      const firstObj = objectIds.slice( 0, 50 );
      const sndObj = objectIds.slice( 50, objectIds.length );
      const firstObjectsWords = await provider.multiGetObjects( {
        ids: firstObj,
        options: {
          showDisplay: true,
        }
      } );
      const sndObjectsWords = await provider.multiGetObjects( {
        ids: sndObj,
        options: {
          showDisplay: true,
        }
      } );
      return [ ...firstObjectsWords, ...sndObjectsWords ];
    } else {
      const objectsWords = await provider.multiGetObjects( {
        ids: objectIds,
        options: {
          showDisplay: true,
        }
      } );
      return objectsWords;
    }
  } catch ( e ) {
    console.log( e );
    return [];
  }
};

export const load = async ( wallet, cursor = "" ) => {
  const words = await getAllObjects( wallet, cursor );
  return words;
};

export const mintPack = async ( packName, wallet ) => {
  const txb = new TransactionBlock();
  txb.moveCall( {
    target: PACKAGE + "::words2words::mintPack",
    arguments: [
      txb.pure( packName ),
      txb.object( WordsDataObject )
    ]
  } );
  try {
    const resData = await wallet.signAndExecuteTransactionBlock( {
      transactionBlock: txb,
      options: {
        showEffects: true,
      }
    } );
    await sleep( 3000 );
    const newWords = await getChangedObjects( wallet, resData.effects.created );
    return newWords;
  } catch ( e ) {
    console.log( e );
    return [];
  }
};

export const mintSentence = async ( wallet, basket, imageUrl, background, title, author ) => {
  if ( !wallet.connected || basket.length == 0 ) return false;
  const txb = new TransactionBlock();

  let objects = basket.map( ( b ) =>
    txb.object( b.objectId )
  );

  txb.moveCall( {
    target: PACKAGE + '::words2words::make_sentence',
    arguments: [
      txb.makeMoveVec( { objects: objects.reverse() } ),
      txb.pure( imageUrl ),
      txb.pure( background ),
      txb.pure( title ),
      txb.pure( author ),
      txb.object( "0x6" )
    ],
  } );
  try {
    // execute the programmable transaction
    const resData = await wallet.signAndExecuteTransactionBlock( {
      transactionBlock: txb
    } );
    console.log( 'sentance minted successfully!', resData );
    return true;
  } catch ( e ) {
    console.error( 'nft mint failed', e );
    return false;
  }
};

export const sentanceToWords = async ( wallet, sentanceId ) => {
  if ( !wallet.connected ) return;
  const txb = new TransactionBlock();
  txb.moveCall( {
    target: PACKAGE + '::words2words::sentence_to_words',
    arguments: [ txb.object( sentanceId ) ],
  } );
  try {
    // execute the programmable transaction
    const resData = await wallet.signAndExecuteTransactionBlock( {
      transactionBlock: txb
    } );
    console.log( 'words minted successfully!', resData );
    return true;
    //load();
  } catch ( e ) {
    console.error( 'nft mint failed', e );
    return false;
  }
};
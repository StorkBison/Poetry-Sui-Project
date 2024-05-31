
module words::words2words{
  use sui::object::{Self,UID};
  use std::string::{String,utf8,append};
  use std::vector;
  use sui::tx_context::{Self,TxContext};
  use sui::transfer::{public_transfer};
  use std::debug::{print};
  use sui::package;
  use sui::display;

  struct Word has key, store {
    id : UID,
    word: String,
  }

  struct Sentence has key, store {
    id : UID,
    sentence: String,
    sentence_test: String,
    words: vector<String>
  }

  struct WORDS2WORDS has drop {}

  fun init(otw: WORDS2WORDS,ctx: &mut TxContext){
    let publisher = package::claim(otw, ctx);
    let keys = vector[
            utf8(b"name"),
            utf8(b"word"),
            utf8(b"image_url"),
            utf8(b"description"),
    ];
    let values = vector[
            utf8(b"{word}"),
            utf8(b"{word}"),
            utf8(b"https://ui-avatars.com/api/?name={word}&length=20&size=512&font-size=0.1&bold=true&rounded=true"),
            utf8(b"A word in the world of words"),
    ];
    
    let display = display::new_with_fields<Word>(&publisher, keys, values, ctx);
    display::update_version(&mut display);
    public_transfer(display, tx_context::sender(ctx));

    let keys = vector[
            utf8(b"name"),
            utf8(b"sentence"),
            utf8(b"image_url"),
            utf8(b"description"),
    ];
    let values = vector[
            utf8(b"{sentence}"),
            utf8(b"{sentence}"),
            utf8(b"https://ui-avatars.com/api/?name={sentence_test}&length=20&size=512&font-size=0.06&bold=true&rounded=true"),
            utf8(b"A sentence in the world of words"),
    ];
    let display = display::new_with_fields<Sentence>(&publisher, keys, values, ctx);
    display::update_version(&mut display);
    public_transfer(display, tx_context::sender(ctx));

    public_transfer(publisher, tx_context::sender(ctx));
  }

  public entry fun mint_word(word: vector<u8>,ctx: &mut TxContext){
    let sender = tx_context::sender(ctx);
    public_transfer(Word {id: object::new(ctx), word: utf8(word)},sender);
  }

  public entry fun make_sentence(words: vector<Word>,ctx: &mut TxContext){
    let sentence : String = utf8(b"");
    let sentence_test : String = utf8(b"");
    let sentence_words = vector::empty<String>();
    //vector::reverse<Word>(&mut words);
    
    while(!vector::is_empty(&words)){
      let Word { id, word } =  vector::pop_back<Word>(&mut words);
      vector::push_back(&mut sentence_words,word);
      append(&mut sentence,word);  
      append(&mut sentence,utf8(b" "));  

      append(&mut sentence_test,word);  
      append(&mut sentence_test,utf8(b"~"));   
      object::delete(id);
    };
    print(&sentence);
    print(&sentence_test);
    let sender = tx_context::sender(ctx);
    public_transfer(Sentence {id: object::new(ctx), sentence: sentence,sentence_test:sentence_test, words: sentence_words},sender);
    vector::destroy_empty(words);
  }

  public entry fun sentence_to_words(sentence: Sentence,ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let Sentence {id, sentence: _,sentence_test: _, words} = sentence;
    while(!vector::is_empty<String>(&words)){
      let word = vector::pop_back<String>(&mut words);
      public_transfer(Word {id: object::new(ctx), word: word},sender);
    };
    object::delete(id);
  }

}

#[test_only]
  module sui::words_test {
    use sui::test_scenario as ts;
    //use std::vector;
    use words::words2words::{mint_word,make_sentence,sentence_to_words,Word,Sentence};
    #[test]
    fun mint_words() {
        let addr1 = @0xA;
        //let addr2 = @0xB;
        //let addr3 = @0xC;

        let scenario = ts::begin(addr1);
        {
            mint_word(b"Hello",ts::ctx(&mut scenario));
            mint_word(b"There",ts::ctx(&mut scenario));
            mint_word(b"From",ts::ctx(&mut scenario));
            mint_word(b"Sui",ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let word = ts::take_from_sender<Word>(&mut scenario);
            let word2 = ts::take_from_sender<Word>(&mut scenario);
            let word3 = ts::take_from_sender<Word>(&mut scenario);
            let word4 = ts::take_from_sender<Word>(&mut scenario);
            make_sentence(vector[word,word2,word3,word4],ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let sentence = ts::take_from_sender<Sentence>(&mut scenario);
            sentence_to_words(sentence,ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, addr1);
        {
            let word = ts::take_from_sender<Word>(&mut scenario);
            ts::return_to_sender(&mut scenario,word);
        };

        ts::end(scenario);
    }
  }

// https://ui-avatars.com/api/?name=congratulations&length=20&size=512&font-size=0.1&bold=true&rounded=true
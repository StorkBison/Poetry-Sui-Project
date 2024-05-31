import TypewriterComponent from "typewriter-effect";
import CommonButton from "./CommonButton";
import Link from "next/link";

const PoetryTypeWrite = () => {
  const handleGetWords = () => { };
  return (
    <div className="text-center w-full my-6">
      <div
        className="w-fit typewriter my-3 mx-auto text-2xl"
        style={{ minHeight: "220px" }}
      >
        <h1 className="mb-4 text-4xl md:text-6xl tracking-tight">Poetry in Motion</h1>
        <TypewriterComponent
          onInit={( typewriter ) => {
            typewriter
              .typeString( "We are a collection, words on the Move;<br />" )
              .typeString(
                "immortalized, distributed, poems for the Louvre.<br />"
              )
              .typeString( "Mint one, mint many, we seek the abstract,<br />" )
              .typeString( "bundled, nested, the words stay intact." )
              .start();
          }}
          options={{ autoStart: true, loop: false, delay: "100" }}
        />
      </div>
      <Link href="/buywordpacks">
        <CommonButton
          onClick={handleGetWords}
          className={
            "border border-1 border-b-2 border-black w-fit self-center text-center text-2xl teinline-flex items-center p-3 m-6 uppercase font-bold text-neutral-900 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          }
          style={{
            backgroundColor: "#4abd6a"
          }}
        >
          Get Words
        </CommonButton>
      </Link>

    </div>
  );
};

export default PoetryTypeWrite;

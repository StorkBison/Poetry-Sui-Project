import Link from 'next/link';
const FAQ = () => {
  return (
    <div className="container flex text-center flex-col justify-center px-4 py-8 mx-auto md:p-8">
      <h2 className="m-4 text-4xl tracking-tight  md:text-6xl">Oft Asked Inquiries</h2>
      <div className="space-y-4">
        <details className="w-full">
          <summary className="px-4 py-6 focus:outline-none text-2xl">How do I play?</summary>
          <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-xl">As with any collectible card game, you can get started with Poetry in Motion by buying <Link href="/buywordpacks" className="underline underline-offset-4 decoration-dotted">a pack of words</Link>. The starter packs come with 33 commonly used words, whereas the themed packs help you get more specific words. </p>
        </details>
        <details className="w-full">
          <summary className="px-4 py-6 focus:outline-none text-2xl">What kinds of words are in a starter pack?</summary>
          <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-xl">Starter packs include a variety of nouns, verbs, adjectives, and other types of words you’ll need to build your first poem. Even though the focus of the starter packs is on commonly used words, each pack will contain at least one rare word. </p>
        </details>
        <details className="w-full">
          <summary className="px-4 py-6 focus:outline-none text-2xl">What do I do after I get my words?</summary>
          <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-xl">Head over to the <Link href="/createpoems" className="underline underline-offset-4 decoration-dotted">Create Poems page.</Link> There you will see all the words you own and can drag and drop those words to create a poem on the board. Select a background, then “Combine and Save” your poem.</p>
        </details>
        <details className="w-full">
          <summary className="px-4 py-6 focus:outline-none text-2xl">How do I reuse words already in a poem?</summary>
          <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-xl">On the <Link href="/mypoems" className="underline underline-offset-4 decoration-dotted">My Poems page</Link> you can view all of your completed poems. If you click on one, in the popup menu you can delete the poem. Deleting the poem will split the words back up into individual words for them to be used in future poems.</p>
        </details>
        <details className="w-full">
          <summary className="px-4 py-6 focus:outline-none text-2xl">If I buy a completed poem from a marketplace, can I split it up to use the words?</summary>
          <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-xl">Yes! One way to get an exact word you’re looking for is to <Link href="/buypoems" className="underline underline-offset-4 decoration-dotted">buy an existing poem</Link> that contains that word. It will show up in your “My Poems” page where you’ll be able to delete the poem to break it into individual words.</p>
        </details>
      </div>
    </div>
  );
};

export default FAQ;
var Quote = function(text, fontSize) 
{
  this.text = text;
  this.fontSize = fontSize;
}
var quotes = [];
var lastNdx = -1;
var currentQuote = undefined;

$(document).ready(function()
{
  quotes.push(new Quote("I have never let my schooling interfere with my education.", "xx-large"));
  quotes.push(new Quote("If you tell the truth, you don't have to remember anything.", "xx-large"));
  quotes.push(new Quote("Whenever you find yourself on the side of the majority, it is time to pause and reflect.", "xx-large"));
  quotes.push(new Quote("Be good and you will be lonesome.", "xx-large"));
  quotes.push(new Quote("In the beginning of a change the patriot is a scarce man, and brave, and hated and scorned. When his cause succeeds, the timid join him, for then it costs nothing to be a patriot.", "xx-large"));
  quotes.push(new Quote("Patriotism is usually the refuge of the scoundrel. He is the man who talks the loudest.", "xx-large"));
  quotes.push(new Quote("The physician's is the highest and worthiest of all occupations, or would be if human nature did not make superstitions and priests necessary.", "xx-large"));
  quotes.push(new Quote("History has tried hard to teach us that we can't have good government under politicians. Now, to go and stick one at the very head of the government couldn't be wise.", "xx-large"));
  quotes.push(new Quote("The Autocrat of Russia possesses more power than any other man in the earth; but he cannot stop a sneeze.", "xx-large"));
  quotes.push(new Quote("The more things are forbidden, the more popular they become.", "xx-large"));
  quotes.push(new Quote("I think we never become really and genuinely our entire and honest selves until we are dead--and not then until we have been dead years and years. People ought to start dead, and they would be honest so much earlier.", "xx-large"));
  quotes.push(new Quote("Heaven goes by favor. If it went by merit, you would stay out and your dog would go in.", "xx-large"));
  quotes.push(new Quote("The dog is a gentleman; I hope to go to his heaven, not man's.", "xx-large"));
  quotes.push(new Quote("If you pick up a starving dog and make him prosperous, he will not bite you. This is the principal difference between a dog and a man.", "xx-large"));
  quotes.push(new Quote("Yes, even I am dishonest. Not in many ways, but in some. Forty-one, I think it is.", "xx-large"));
  quotes.push(new Quote("What marriage is to morality, a properly conducted licensed liquor traffic is to sobriety.", "xx-large"));
  quotes.push(new Quote("Of the demonstrably wise there are but two: those who commit suicide, & those who keep their reasoning faculties atrophied with drink.", "xx-large"));
  quotes.push(new Quote("I was drowned seven times...before I learned to swim--once in Bear Creek and six times in the Mississippi. I do not know who the people were who interfered with the intentions of a Providence wiser than themselves but I hold a grudge against them yet.", "xx-large")); 
  quotes.push(new Quote("The devil's aversion to holy water is a light matter compared with a despot's dread of a newspaper that laughs.", "xx-large"));
  quotes.push(new Quote("I am not the editor of a newspaper and shall always try to do right and be good so that God will not make me one.", "xx-large"));
  quotes.push(new Quote("All men in New York insult you--there seem to be no exceptions. There are exceptions of course--have been--but they are probably dead. I am speaking of all persons there who are clothed in a little brief authority.", "xx-large"));
  quotes.push(new Quote("There is one thing very sure--I can't keep my temper in New York. The cars and carriages always come along and get in the way just as I want to cross a street, and if there is any thing that can make a man soar into flights of sublimity in the matter of profanity, it is that thing.", "xx-large"));
  quotes.push(new Quote("You do not swear anymore now, of course, because you can't find any words that are long enough or strong enough to fit the case. You feel degraded and ignominious and subjugated. And there and then you say that you will go away from New York and start over again; and that you will never come back to settle permanently till you have learned to swear with the utmost fluency in seventeen different languages.", "x-large"));
  quotes.push(new Quote("Ah, well, I am a great and sublime fool.  But then I am God's fool, and all His works must be contemplated with respect.", "xx-large"));
  quotes.push(new Quote("When a man loves cats, I am his friend and comrade, without further introduction.", "xx-large"));
});
  quotes.push(new Quote("Of all God's creatures there is only one that cannot be made the slave of the lash. That one is the cat. If man could be crossed with the cat it would improve man, but it would deteriorate the cat.", "xx-large"));
  quotes.push(new Quote("One of the most striking differences between a cat and a lie is that a cat has only nine lives.", "xx-large"));
  quotes.push(new Quote("But the truth is, that when a Library expels a book of mine and leaves an unexpurgated Bible lying around where unprotected youth and age can get hold of it, the deep unconscious irony of it delights me and doesn't anger me.", "xx-large"));
  quotes.push(new Quote("Communism is idiocy. They want to divide up the property. Suppose they did it -- it requires brains to keep money as well as make it. In a precious little while the money would be back in the former owner's hands and the communist would be poor again.", "xx-large"));
  quotes.push(new Quote("I complimented this police force in a letter some time ago, and felt like a guilty, degraded wretch when I was doing it, and now I am glad I got into the Station House, because it will teach me never to so far forget all moral principle as to compliment a police force again.", "xx-large"));
  quotes.push(new Quote("The political and commercial morals of the United States are not merely food for laughter, they are an entire banquet.", "xx-large"));
  quotes.push(new Quote("I am quite sure now that often, very often, in matters concerning religion and politics a man's reasoning powers are not above the monkey's.", "xx-large"));
  quotes.push(new Quote("In religion and politics people's beliefs and convictions are in almost every case gotten at second-hand, and without examination, from authorities who have not themselves examined the questions at issue but have taken them at second-hand from other non-examiners, whose opinions about them were not worth a brass farthing.", "x-large"));
  quotes.push(new Quote("One of the first achievements of the legislature was to institute a ten-thousand-dollar agricultural fair to show off forty dollars' worth of pumpkins in -- however, the Territorial legislature was usually spoken of as the \"asylum\".", "xx-large"));
  quotes.push(new Quote("It was the most earnest ambition I ever had....Not that I ever really wanted to be a preacher, but because it never occurred to me that a preacher could be damned. It looked like a safe job.", "xx-large"));
  quotes.push(new Quote("Preachers are always pleasant company when they are off duty.", "xx-large"));
  quotes.push(new Quote("The whole burden of postal cost comes upon the senders of letters. To my mind it is nothing but downright robbery to extort $1 a pound for letters. If the post office is in the robbery business let it be on a decent scale. If it is going to rob the public, let it do it for $10, instead of $1. A crime of magnitude may be forgiven, but petty larceny always is abhorrent.", "x-large"));
  quotes.push(new Quote("Public servants--Persons chosen by the people to distribute the graft.", "xx-large"));
  quotes.push(new Quote("Never put off till tomorrow what may be done day after tomorrow just as well.", "xx-large"));
  quotes.push(new Quote("When we were finishing our house, we found we had a little cash left over, on account of the plumber not knowing it.", "xx-large"));
  quotes.push(new Quote("Suppose you were an idiot. And suppose you were a member of Congress. But I repeat myself.", "xx-large"));
  quotes.push(new Quote("All Congresses and Parliaments have a kindly feeling for idiots, and a compassion for them, on account of personal experience and heredity.", "xx-large"));
    quotes.push(new Quote("It could probably be shown by facts and figures that there is no distinctly native American criminal class except Congress.", "xx-large"));
  quotes.push(new Quote("Whenever a copyright law is to be made or altered, then the idiots assemble.", "xx-large"));
  quotes.push(new Quote("Only one thing is impossible for God: to find any sense in any copyright law on the planet.", "xx-large"));
  quotes.push(new Quote("Yes, the weather is bad, and if I were dealing in weather it is not the brand that I'd put up in cans for future use. No, it is the kind of weather I'd throw on the market and let it go for what it would fetch, and if it wouldn't sell for anything I would hunt up some life-long enemy and present it to him. Failing in this, as a last resort I should probably take it out on the big bridge, dump it into the Mississippi and start it to Europe via the jetties. I'd unload it someway, and that quickly, too.", "x-large"));
  quotes.push(new Quote("Winter is begun here, now, I suppose. It blew part of the hair off the dog yesterday & got the rest this morning.", "xx-large"));

$("#get-quote-button").on("click", onButtonClick);

function getNextQuote()
{
  for (;;)
  {
    var ndx = Math.floor(Math.random() * quotes.length);
    if (ndx != lastNdx)
    {
      lastNdx = ndx;
      return quotes[ndx];
    }
  }
}

function removeCurrentQuote()
{
  $("#quote-text").removeClass("animated rotateIn")
                  .addClass("animated rotateOut")
                  .css("font-size", currentQuote.fontSize)
                  .text(currentQuote.text);
}

function addNewQuote()
{
  currentQuote = getNextQuote();
  $("#quote-block").html("<div id='quote-text' class='text-justify'></div>");
  $("#quote-text").addClass("animated rotateIn")
                  .css("font-size", currentQuote.fontSize)
                  .text(currentQuote.text);
  
  // Twitter support
  $("#twitter-button").html("");
  twttr.widgets.createShareButton(
    "",
    document.getElementById("twitter-button"),
    {
      count: "none",
      text: currentQuote.text
    })
    .then(function()
   {
     console.log("Button created");
   });
}

function onButtonClick()
{
  // If not quote has yet been selected, just display it and be done with it.
  if (!currentQuote)
  {
    addNewQuote();
    return;
  }

  removeCurrentQuote();
  
  window.setTimeout(function()
  {
    addNewQuote();
  },
  1500);
}

The PackedBubble Package actually contains two different kind of graphs in the same package. 

packedbubbles.html is a file for a site that displays bubble charts (charts where the bubbles represent words, with the size determined by the frequency of the word in the Book of Mormon). 

treecharts.html is a file for a site that displays the same data using a treemap. It is similar to a bubble chart, but instead uses blocks/regions of color instead of bubbles to reflect the frequency as a portion of a whole.

The functionality between the two graphs is very similar and will use the same data ultimately, so they are packaged together. They could even be integrated onto the same page, which we did talk about before.

Both pages feature a help button which explains the way to interact with the page, so you can click that to get an idea of what they page is supposed to do from the user's end.

In terms of useful information to pass on for maintenance...

SPECS FOR EACH PAGE:

The specs I was given was honestly very open ended for better or worse. I tried to get a more specific vision down by talking with Dr. Fields, and these are they key points we got down to.

Both Pages:
- Data for word frequency is drawn from a CSV file. The data can be pre-processed and loaded locally or from a server, or taken from the CSV file. (I pre-processed it into JSON, loaded it to github, and retrieved it from there for now).

- Data must be broken down into 3 distinct sets. Content Words, Function Words, and words by theme. Content words are nouns, verbs, adjs, etc while function words are conjunctions, articles etc. The words by theme should in theory would be included as part of the data. In essensce, one CSV file of data should result in 3 unique data sets based on the parts of speech and the themes of the words (I created 3 json files from each csv file).

- There should be options for filtering data by part of speech or number of words to display. This is why I chose to pre-process the data to JSON, so filtering became easier. Currently packedbubble.html included filtering tools, but treecharts.html does not. It may not need as serious filtering since the drill down functionality essentially serves as filtering, so this should be confirmed with Dr. Fields if it is fine as is.

- Be able to display data for different speakers. The graphs are to be divided by the different speakers in the Book of Mormon. That is, each speaker will have the 3 different chart types mentioned above. The page needs to have some way to select a different speaker and switch out the data to match.

PackedBubble:
- "Zoom-In" on bubble when clicked. Dr. Fields wanted that when a bubble is clicked, the graph zooms in on it and focuses on that one word. When it zooms in, he wanted it to display the word and a quote from the Book of Mormon (that should also be included with the data) that scrolls across the bubble. There was no good way to do all of this using the API for the entire graph, so as an alternate solution, I created my own circle on the page and passed in data from the original graph and manipulated the html to display as if it was part of the original graphing API. Its a very imperfect solution that is explained more in the code, but I could not think of anything better since he wanted to display quotes and stuff. The color of the new bubble is a problem.

TreeCharts:
- Drill down functionality. The chart should be split by layers, the first one being content words vs. function words. When one of those two division is clicked, the chart should focus on those and display parts of speech. When a part of speech is selected, then all the words of that part of speech are displayed. When a word is selected, then the word fills the screen. This is already in place with the treecharts.html, but I wrote here for a reminder.

Things to do:
- Find a permanent home for the data sets. Right now, the packed bubbles chart is retrieving data from my github since I was not told what would be the final place for it. I'm guessing it would be somewhere on the visible language server, but I did not get to that point, so that will need to be adjusted. 

- Automate the data retrieval and changing of data sets for the treecharts.html page. Right now, it is using a single sample data set that is hard coded into the chart. The PackedBubble code is set up to where as long as it is retrieving data from my github, it can interchange the data sets which are controlled by the sidebar. There are so many solutions for this, and I am totally happy if you find a better one than the janky side bar that is there that relys on having the id match the file name on github. Essentially both the treecharts and packedbubbles needs to be able to handling the interchange of the different data sets for each speaker. I talk about my solution using the file set up on my github in the javascript files, but whichever solution you decide to use is great. 

- I strongly recommend looking at some of the sample json data sets on my github. Highcharts graphing API is pretty finicky with the names/structure of the data, so I kept it simple. The name of each series (i.e. "name: Nouns, series: []") is important because that is used in the filtering by part of speech. Again, I don't mind if all of this is changed for a much more reliable and clean solution, but I wanted to make sure that connection is clear. If you choose to structure the data from the CSV file differently, you will likely need to rework the filtering since they are pretty connected unfortunately. That is totally my fault for it not being flexible enough.

- Look into the coloring of the bubbles in the Highcharts API. For some reason, when I added a color element to the data sets, they did not change the default coloring of the bubbles. If each part of speech/theme could be associated with a specific color somehow, and not a random default that would be good. I'm not sure why it wouldn't work. The treecharts sample data set actually controls the colors, but the same approach did not work on the packedbubbles for some reason.

- Visual cleaning up. I cannot stress enough how ugly I made the pages. I would take a look at some of the sample pages from Dr. Fields and try to match that feeling. Unfortunatley they use a lot of brown and gold, which are pretty hard to make look nice, but the whole thing needs a make over.

- CSS on the sidebar. The side bar which contains the speaker names to use for the various data sets does not deal with being shrunk well. I was in a rush and focused on the JS side of things, so the CSS in general is a super hack job, but works essentially. This part particularly is a problem though.

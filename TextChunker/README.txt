TextChunker

This is a simple Python app Dr. Fields wanted me to write that could take in a folder full of text files and return them broken down into "sub-files" based on a user entered number of chunks to break the file into.

For example, if a folder and the number 3 are entered, then every text file in the folder is broken up into 3 evenly sized (by word count) files and stored in separate folders based on the original files name in an output folder. Punctuation of the original text is retained.

For user-friendlyness, the app is created with a Tkinter GUI that allows for a simple file selection screen and a field to enter the number of chunks into, as well as a few pop up messages that explain the common errors, or a completion message. 

To my current knowledge, this file already does what Dr. Fields intends for it to do and shouldn't need much more changing unless he noticed something else. 

The code is all in one file, divided into a GUI class and a TextChunker class, but it is not a particularly complicated python file at all and has plenty of comments.

An executable file made with pyinstaller is included in the dist folder. This is what Dr. Fields is likely most interested in since he wanted some way to make using it easier for people. 
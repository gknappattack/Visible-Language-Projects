TextChunker

Run Instructions
This program can be run with any Python3 installation.

2 inputs are required to run the program. One is a relative path to the file to be split up. The second is the number of files to break up each individual text file into.

A sample run command is given below

python main.py [1] [2]
1: The relative path to the directory containing the text files to chunk
2: Number of chunks to gbreak up a file into
The TextChunker will give output in a folder called "output" in the same relative directory as the script and text files. For each text file parsed, a folder inside of the "output" folder will be generated and the chunked files will be found in there.

For example, given the following folder structure and run command:

D:.
|   main.py
|   
+---speakers
|   |   Aaron.txt
|   |   Abinadi.txt
|   |   Abinadom.txt
\

python main.py "speakers\" 3
The expected output would result as follows:

D:.
|   main.py
|           
+---speakers
|   |   Aaron.txt
|   |   Abinadi.txt
|   |   Abinadom.txt
|   |   
|   \---output
|       +---Aaron
|       |       Aaron_1.txt
|       |       Aaron_2.txt
|       |       Aaron_3.txt
|       |       
|       +---Abinadi
|       |       Abinadi_1.txt
|       |       Abinadi_2.txt
|       |       Abinadi_3.txt
|       |       
|       +---Abinadom
|       |       Abinadom_1.txt
|       |       Abinadom_2.txt
|       |       Abinadom_3.txt
|       \       
\
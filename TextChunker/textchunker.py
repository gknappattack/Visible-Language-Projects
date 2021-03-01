import tkinter as tk
from os import listdir, mkdir
from os.path import join, isfile
from tkinter import filedialog as fd
from tkinter import messagebox
from shutil import copy


class TextChunker:

    # Initializes key variables for creation of the output.
    def __init__(self, input_dir, chunk_val):
        self.output_dir = "output"
        self.filepath = input_dir
        self.chunk_count = chunk_val

        # Get file names from directory
        self.only_files = [f for f in listdir(self.filepath) if isfile(join(self.filepath, f))]

        # Create directory for output files
        self.output_folder = join(self.filepath, self.output_dir)

    # The main text processing function. All the output files and folders are created in here
    def chunk_files(self):
        while True:
            try:
                mkdir(self.output_folder)
                break
            except FileExistsError:
                return 2

        all_chunks = "/all_chunks"
        all_chunks_dir = self.output_folder + all_chunks

        # This is a directory to contain all the output files in one central location
        mkdir(all_chunks_dir)

        for f in self.only_files:
            # Get name of current speaker to create directory
            dir_name = f[0:-4]

            print("\nProcessing file \"" + dir_name + ".txt\"")

            # Check if current file is a text file
            if not f.endswith(".txt"):
                return 1

            # Open current file from base directory
            curr_file = open(join(self.filepath, f))

            # Remove punctuation from current file, send to array
            file_data = curr_file.read()
            file_words = file_data.split()

            # Create new directory for speaker data
            new_path = self.output_folder + "/"
            new_dir = join(new_path, dir_name)
            mkdir(new_dir)

            # Initialize values for iteration through files
            words_per_chunk = round((len(file_words) / self.chunk_count))
            word_start_index = 0
            word_end_index = words_per_chunk

            for i in range(0, self.chunk_count):
                print("---Creating Chunk #" + str(i + 1))

                # Check if out of range for files that don't split evenly
                if i == (self.chunk_count - 1):
                    if word_end_index != len(file_words):
                        # print("*********Non-matching value found ************")
                        word_end_index = len(file_words)

                # Get array of words to print
                curr_chunk = file_words[word_start_index:word_end_index]

                # Increment values used to count words to print
                word_start_index += words_per_chunk
                word_end_index += words_per_chunk

                # Create string for output file name
                file_str = dir_name + "_" + str(i + 1)
                chunk_file_name = join(new_dir, file_str)

                # Open output file and print array with spaces to it
                chunk_file = open(chunk_file_name + ".txt", "w")
                chunk_file.write(" ".join(curr_chunk))
                chunk_file.close()

                # Copy the file to the "all_chunks" directory containing all output files.
                copy(chunk_file_name + ".txt", all_chunks_dir)

        return 0


class TextChunkerGUI:
    def __init__(self, window):
        # Create GUI Window
        self.window = window
        window.title("Text Chunker Application")
        window.maxsize(600, 210)
        window.minsize(600, 210)

        # Configure window
        window.rowconfigure([0, 1, 2, 3, 4], weight=1)
        window.columnconfigure(0, weight=1)

        # Create Containers
        frame_title = tk.Frame(window, width=300, height=60, borderwidth=1)
        frame_input_text = tk.Frame(window, width=300, height=40, borderwidth=1)
        frame_input_file_select = tk.Frame(window, width=300, height=110)
        frame_concept_count = tk.Frame(window, width=300, height=40, borderwidth=1)
        frame_buttons = tk.Frame(window, width=300, height=40, borderwidth=1)

        # set frames
        frame_title.grid(row=0, sticky="nsew")
        frame_input_text.grid(row=1, sticky="nsew")
        frame_input_file_select.grid(row=2, sticky="nsew")
        frame_concept_count.grid(row=3, sticky="nsew")
        frame_buttons.grid(row=4, sticky="nsew")

        # Create widgets for title text
        label_title = tk.Label(frame_title, text="Text Chunker Application", font="Helvetica 18 bold")

        label_title.pack()

        # Create widgets for input message frame
        file_input_message = "Select the folder containing the files to chunk: "
        label_input_file_select = tk.Label(frame_input_text, text=file_input_message)
        label_input_file_select.pack()

        # Create widgets for input file frame
        self.entry_input_file_name = tk.Entry(frame_input_file_select, width=80)
        browse_input_file_btn = tk.Button(frame_input_file_select, text="Select Folder", command=self.get_path)
        self.entry_input_file_name.pack(side=tk.LEFT, expand=True)
        browse_input_file_btn.pack(side=tk.RIGHT, expand=True)

        # Create widgets for the number of conceptEntries frame
        conceptLabel = "Enter the number chunks to create for each file: "
        concept_count_text = tk.Label(frame_concept_count, text=conceptLabel)
        self.chunk_entry = tk.Entry(frame_concept_count, width=10)

        concept_count_text.pack(side=tk.LEFT, padx=10)
        self.chunk_entry.pack(side=tk.LEFT, pady=5)

        # create widgets for bottom frame
        go_button = tk.Button(frame_buttons, text="Run", width=15, command=self.run_splitter)
        cancel_button = tk.Button(frame_buttons, text="Quit", width=15, command=self.quit_program)
        go_button.pack(side=tk.RIGHT, padx=10, pady=5)
        cancel_button.pack(side=tk.RIGHT)

    def get_path(self):
        filepath = fd.askdirectory()

        # Check for valid directory path
        if not filepath:
            return
        self.entry_input_file_name.delete(0, tk.END)
        self.entry_input_file_name.insert(0, filepath)

    def quit_program(self):
        self.window.destroy()

    def run_splitter(self):
        text_file_directory = self.entry_input_file_name.get() + "/"
        chunk_value = int(self.chunk_entry.get())

        print(text_file_directory)
        print(chunk_value)

        # Check for valid input for chunks (must be 1 or greater)
        if chunk_value <= 0:
            messagebox.showerror(title="Invalid Chunk Value Detected",
                                 message="Value of chunks to create must be at least 1.")
            return

        text_chunker = TextChunker(text_file_directory, chunk_value)
        return_code = text_chunker.chunk_files()

        # Handling of the possible errors that are checked for in the TextChunker class

        # TODO: For some reason I placed these in the wrong order, that can be cleaned up
        if return_code == 2:
            messagebox.showerror(title="Output Folder Already Exists",
                                 message="Output folder already detected inside selected directory. Please delete "
                                         "any previous output folders generated by Text Chunker and try again")
        elif return_code == 1:
            messagebox.showerror(title="Invalid File Format Detected",
                                 message="File of non-.txt extension detected.\nPlease confirm all files in "
                                         "the input folder are .txt files and try again.")
        elif return_code == 0:
            messagebox.showinfo(title="Files Chunked Successfully",
                                message="Files located in directory " + text_file_directory + " have been "
                                        "successfully chunked!")


# Run GUI application
app_window = tk.Tk()
chunkerApp = TextChunkerGUI(app_window)
app_window.mainloop()

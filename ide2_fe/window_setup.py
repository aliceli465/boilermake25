from PyQt6.QtCore import QSize, Qt
from PyQt6.QtWidgets import *

def import_button_clicked():
        print("nokotan") 

class MainIdeWindow(QMainWindow):   

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Reactive IDE")

        # Set the default layout
        layout = QGridLayout()

        # Defining the base component widgets for our layout
        file_list = QTextEdit()
        first_file = QTextEdit()

        edit_window = QTabWidget()
        term_window = QTabWidget()

        import_button = QPushButton()
        import_button.setText("Import File or Folder")
        import_button.clicked.connect(import_button_clicked)


        settings_button = QPushButton()
        settings_button.setText("Settings") #To be implemented later...

        # Tabulation for files
        edit_window.addTab(first_file, "First Tab")

        #Horizontal splitter for buttons (import, settings, etc.)
        buttons_split = QSplitter(Qt.Orientation.Horizontal)
        buttons_split.addWidget(import_button)
        buttons_split.addWidget(settings_button)

        #Add vertical splitter for left side (buttons + file directories)
        left_split = QSplitter(Qt.Orientation.Vertical)
        left_split.addWidget(buttons_split)
        left_split.addWidget(file_list)

         # Add vertical splitter for terminal  
        right_split = QSplitter(Qt.Orientation.Vertical)
        right_split.addWidget(edit_window)
        right_split.addWidget(term_window)
        right_split.setSizes([500, 50])

        # Add a splitter layout
        vert_split = QSplitter(Qt.Orientation.Horizontal)
        vert_split.addWidget(left_split)
        vert_split.addWidget(right_split)
        # Set initial widget sizes
        vert_split.setSizes([100, 400])

        # Get the master layout sorted
        central_widget = QWidget()
        hbox = QHBoxLayout(central_widget)
        hbox.addWidget(vert_split)

        # Set the central widget of the Window.
        self.setCentralWidget(central_widget)
from PyQt6.QtCore import QSize, Qt
from PyQt6.QtWidgets import *

#Heavy lifting happens here
class MainIdeWindow(QMainWindow):   

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Reactive IDE")

        # Set the default layout
        layout = QGridLayout()

        # Defining the base component widgets for our layout
        file_list = QTextEdit()
        self.editor = QTextEdit()

        edit_window = QTabWidget()
        term_window = QTabWidget()

        import_button = QPushButton()
        import_button.setText("Import File or Folder")
        import_button.clicked.connect(self.import_button_clicked)


        save_button = QPushButton()
        save_button.setText("Save") 
        save_button.clicked.connect(self.save_button_clicked)

        # Tabulation for files
        edit_window.addTab(self.editor, "First Tab") #class attribute 

        #Horizontal splitter for buttons (import, save, etc.)
        buttons_split = QSplitter(Qt.Orientation.Horizontal)
        buttons_split.addWidget(import_button)
        buttons_split.addWidget(save_button)

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
    
    def import_button_clicked(self):
        print("Trigger import")
        file_name, _ = QFileDialog.getOpenFileName(self, "Open File", "", "Python Files (*.py);;All Files (*)")
        if file_name:
            with open(file_name, "r", encoding="utf-8") as file:
                self.editor.setText(file.read())

    def save_button_clicked(self):
        print("Trigger save")
        file_name, _ = QFileDialog.getSaveFileName(self, "Save File", "", "Python Files (*.py);;All Files (*)")
        if file_name:
            with open(file_name, "w", encoding="utf-8") as file:
                #print("Saving...")
                #print(self.editor.toPlainText())
                file.write(self.editor.toPlainText())

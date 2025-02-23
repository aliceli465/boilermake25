import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QTextEdit, QFileDialog
from PyQt6.QtGui import QAction, QTextCharFormat, QColor, QSyntaxHighlighter
from tree_sitter import Language, Parser

# Load Tree-sitter Language (Ensure you compiled it first)
LANGUAGE = Language("tree-sitter-python.so", "python")
parser = Parser()
parser.set_language(LANGUAGE)


class SyntaxHighlighter(QSyntaxHighlighter):
    def highlightBlock(self, text):
        # Parse the text using Tree-sitter
        tree = parser.parse(bytes(text, "utf8"))
        root_node = tree.root_node

        # Highlight keywords
        keyword_format = QTextCharFormat()
        keyword_format.setForeground(QColor("blue"))

        for node in root_node.children:
            if node.type in ["keyword", "function_definition"]:
                self.setFormat(node.start_byte, node.end_byte - node.start_byte, keyword_format)


class TextEditor(QMainWindow):
    def __init__(self):
        super().__init__()
        self.text_edit = QTextEdit(self)
        self.setCentralWidget(self.text_edit)
        self.init_ui()

        # Apply syntax highlighting
        self.highlighter = SyntaxHighlighter(self.text_edit.document())

    def init_ui(self):
        self.setWindowTitle("PyQt6 Text Editor with Tree-sitter")
        self.resize(800, 600)

        menubar = self.menuBar()
        file_menu = menubar.addMenu("File")

        open_action = QAction("Open", self)
        open_action.triggered.connect(self.open_file)
        file_menu.addAction(open_action)

        save_action = QAction("Save", self)
        save_action.triggered.connect(self.save_file)
        file_menu.addAction(save_action)

        exit_action = QAction("Exit", self)
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)

    def open_file(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "Open File", "", "Python Files (*.py);;All Files (*)")
        if file_name:
            with open(file_name, "r", encoding="utf-8") as file:
                self.text_edit.setText(file.read())

    def save_file(self):
        file_name, _ = QFileDialog.getSaveFileName(self, "Save File", "", "Python Files (*.py);;All Files (*)")
        if file_name:
            with open(file_name, "w", encoding="utf-8") as file:
                file.write(self.text_edit.toPlainText())


if __name__ == "__main__":
    app = QApplication(sys.argv)
    editor = TextEditor()
    editor.show()
    sys.exit(app.exec())

import sys
from PyQt6.QtCore import QSize, Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QTextEdit, QVBoxLayout, QWidget, QLineEdit
from PyQt6.QtCore import QProcess

class BuggyShellWidget(QTextEdit):
    def __init__(self):
        super().__init__()

        self.setReadOnly(False)  # Allow typing
        self.process = QProcess()
        self.process.readyReadStandardOutput.connect(self.read_output)
        self.process.readyReadStandardError.connect(self.read_error)

        # Start shell (Windows: cmd, Linux/Mac: bash)
        self.process.start("cmd" if sys.platform == "win32" else "bash")

        self.prompt = "> "  # Prompt symbol
        self.append(self.prompt)  # Show prompt on startup
        self.moveCursor(self.textCursor().MoveOperation.End)  # Move cursor to end

    def keyPressEvent(self, event):
        """Handle Enter key to send commands."""
        if event.key() == Qt.Key.Key_Return:
            text = self.toPlainText().split("\n")[-1]  # Get last line
            command = text.replace(self.prompt, "").strip()  # Remove prompt
            if command:
                self.process.write((command + "\n").encode())  # Send command
        else:
            super().keyPressEvent(event)  # Allow normal typing

    def read_output(self):
        """Read standard output from the shell process."""
        output = self.process.readAllStandardOutput().data().decode()
        self.append(output + self.prompt)  # Append result and new prompt
        self.moveCursor(self.textCursor().MoveOperation.End)

    def read_error(self):
        """Read standard error output from the shell process."""
        error = self.process.readAllStandardError().data().decode()
        self.append(error + self.prompt)
        self.moveCursor(self.textCursor().MoveOperation.End)
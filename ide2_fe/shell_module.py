import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QTextEdit, QVBoxLayout, QWidget, QLineEdit
from PyQt6.QtCore import QProcess

class ShellWidget(QWidget):
    def __init__(self):
        super().__init__()

        self.layout = QVBoxLayout()
        self.output = QTextEdit()
        self.output.setReadOnly(True)
        self.input_line = QLineEdit()

        # Create QProcess for running the shell
        self.process = QProcess()
        self.process.readyReadStandardOutput.connect(self.read_output)
        self.process.readyReadStandardError.connect(self.read_error)
        self.process.start("cmd" if sys.platform == "win32" else "bash")  # Windows -> cmd, Linux/Mac -> bash

        # Connect Enter key in input line to send command
        self.input_line.returnPressed.connect(self.run_command)

        self.layout.addWidget(self.output)
        self.layout.addWidget(self.input_line)
        self.setLayout(self.layout)

    def run_command(self):
        command = self.input_line.text().strip()
        if command:
            self.process.write((command + "\n").encode())  # Send command to the shell
            self.output.append(f"> {command}")
            self.input_line.clear()

    def read_output(self):
        self.output.append(self.process.readAllStandardOutput().data().decode())

    def read_error(self):
        self.output.append(self.process.readAllStandardError().data().decode())
import os
import sys
from pathlib import Path

# Füge das Projektverzeichnis zum Python-Path hinzu
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import unittest
import time
import pytest
import statistics
from typing import List, Dict
from unittest.mock import Mock, patch
import json

from apps.web.components.three.effects.PostProcessing import PostProcessing, effectPresets
from apps.web.components.three.renderer.AdvancedRenderer import AdvancedRenderer, qualityPresets
from apps.web.components.three.effects.Effects import Effects

class TestPerformance(unittest.TestCase):
    def setUp(self):
        """Setup für Performance-Tests"""
        self.iterations = 5
        self.scene_sizes = [100, 1000, 10000]  # Anzahl der Objekte in der Szene
        self.mock_three = Mock()
        self.mock_effect_composer = Mock()
        
    def measure_execution_time(self, func, *args) -> float:
        """Misst die Ausführungszeit einer Funktion"""
        start_time = time.perf_counter()
        func(*args)
        end_time = time.perf_counter()
        return end_time - start_time
        
    def test_post_processing_performance(self):
        """Performance-Test für PostProcessing-Komponente"""
        results: Dict[str, Dict[str, List[float]]] = {}
        
        # Teste verschiedene Effekt-Presets
        for preset_name, preset in effectPresets.items():
            times: List[float] = []
            
            # Führe mehrere Iterationen durch
            for _ in range(self.iterations):
                with patch('@react-three/postprocessing', autospec=True) as mock_post:
                    post_processing = PostProcessing({
                        'enabled': True,
                        'effects': preset
                    })
                    
                    # Simuliere Render-Zyklus
                    execution_time = self.measure_execution_time(
                        post_processing.render,
                        {'deltaTime': 0.016}  # ~60 FPS
                    )
                    times.append(execution_time)
            
            # Berechne Statistiken
            avg_time = statistics.mean(times)
            std_dev = statistics.stdev(times) if len(times) > 1 else 0
            
            print(f"\nPerformance für Preset {preset_name}:")
            print(f"Durchschnittliche Zeit: {avg_time:.4f} Sekunden")
            print(f"Standardabweichung: {std_dev:.4f} Sekunden")
            
            results[preset_name] = {
                'times': times,
                'average': avg_time,
                'std_dev': std_dev
            }
            
    def test_renderer_quality_performance(self):
        """Performance-Test für verschiedene Renderer-Qualitätseinstellungen"""
        results: Dict[str, Dict[str, List[float]]] = {}
        
        # Teste verschiedene Qualitätseinstellungen
        for quality, settings in qualityPresets.items():
            times: List[float] = []
            
            # Führe mehrere Iterationen durch
            for _ in range(self.iterations):
                renderer = AdvancedRenderer(settings)
                execution_time = self.measure_execution_time(
                    renderer.render,
                    {'deltaTime': 0.016}  # ~60 FPS
                )
                times.append(execution_time)
            
            # Berechne Statistiken
            avg_time = statistics.mean(times)
            std_dev = statistics.stdev(times) if len(times) > 1 else 0
            
            print(f"\nPerformance für Qualität {quality}:")
            print(f"Durchschnittliche Zeit: {avg_time:.4f} Sekunden")
            print(f"Standardabweichung: {std_dev:.4f} Sekunden")
            
            results[quality] = {
                'times': times,
                'average': avg_time,
                'std_dev': std_dev
            }
            
    def test_effects_performance_scaling(self):
        """Test der Performance-Skalierung mit steigender Szenenkomplexität"""
        results: Dict[int, Dict[str, float]] = {}
        
        for size in self.scene_sizes:
            # Erstelle eine Testszene mit der angegebenen Größe
            mock_scene = self.create_mock_scene(size)
            
            effects = Effects({
                'enableBloom': True,
                'enableGlow': True,
                'bloomStrength': 0.5,
                'bloomRadius': 0.4
            })
            
            times: List[float] = []
            for _ in range(self.iterations):
                execution_time = self.measure_execution_time(
                    effects.render,
                    {'scene': mock_scene, 'deltaTime': 0.016}
                )
                times.append(execution_time)
            
            avg_time = statistics.mean(times)
            std_dev = statistics.stdev(times) if len(times) > 1 else 0
            
            print(f"\nPerformance für Szenengröße {size}:")
            print(f"Durchschnittliche Zeit: {avg_time:.4f} Sekunden")
            print(f"Standardabweichung: {std_dev:.4f} Sekunden")
            
            results[size] = {
                'average_time': avg_time,
                'std_dev': std_dev,
                'objects_per_second': size / avg_time
            }
            
        # Speichere die Ergebnisse in einer JSON-Datei
        with open('performance_results.json', 'w') as f:
            json.dump(results, f, indent=2)
            
    def create_mock_scene(self, size: int) -> Mock:
        """Erstellt eine Mock-Szene mit der angegebenen Anzahl von Objekten"""
        scene = Mock()
        scene.children = [Mock() for _ in range(size)]
        return scene

if __name__ == '__main__':
    unittest.main()

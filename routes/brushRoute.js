const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о кистях
const brushesDataPath = path.join(__dirname, '../data/brushes.json');

// Функция для чтения данных из файла
async function readBrushesData() {
  const data = await fs.readFile(brushesDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeBrushesData(data) {
  await fs.writeFile(brushesDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления новой кисти
router.post('/', async (req, res) => {
  try {
    const brushesData = await readBrushesData();
    const newBrush = { id: Date.now().toString(), ...req.body };
    brushesData.brushes.push(newBrush);
    await writeBrushesData(brushesData);
    res.status(201).json(newBrush);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении новой кисти' });
  }
});

// Маршрут для получения списка всех кистей
router.get('/', async (req, res) => {
  try {
    const brushesData = await readBrushesData();
    res.status(200).json(brushesData.brushes);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка кистей' });
  }
});

// Маршрут для получения одной кисти по ID
router.get('/:id', async (req, res) => {
  try {
    const brushesData = await readBrushesData();
    const brush = brushesData.brushes.find(b => b.id === req.params.id);
    if (!brush) res.status(404).json({ message: 'Кисть не найдена' });
    res.status(200).json(brush);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении кисти' });
  }
});

// Маршрут для обновления кисти по ID
router.patch('/:id', async (req, res) => {
  try {
    const brushesData = await readBrushesData();
    const brushIndex = brushesData.brushes.findIndex(b => b.id === req.params.id);
    if (brushIndex === -1) res.status(404).json({ message: 'Кисть не найдена' });
    brushesData.brushes[brushIndex] = { ...brushesData.brushes[brushIndex], ...req.body };
    await writeBrushesData(brushesData);
    res.status(200).json(brushesData.brushes[brushIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении кисти' });
  }
});

// Маршрут для удаления кисти по ID
router.delete('/:id', async (req, res) => {
  try {
    const brushesData = await readBrushesData();
    const brushIndex = brushesData.brushes.findIndex(b => b.id === req.params.id);
    if (brushIndex === -1) res.status(404).json({ message: 'Кисть не найдена' });
    brushesData.brushes.splice(brushIndex, 1);
    await writeBrushesData(brushesData);
    res.status(200).json({ message: 'Кисть удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении кисти' });
  }
});

module.exports = router;

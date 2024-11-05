const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о смолах
const resinsDataPath = path.join(__dirname, '../data/resins.json');

// Функция для чтения данных из файла
async function readResinsData() {
  const data = await fs.readFile(resinsDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeResinsData(data) {
  await fs.writeFile(resinsDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления новой смолы
router.post('/', async (req, res) => {
  try {
    const resinsData = await readResinsData();
    const newResin = { id: Date.now().toString(), ...req.body };
    resinsData.resins.push(newResin);
    await writeResinsData(resinsData);
    res.status(201).json(newResin);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении новой смолы' });
  }
});

// Маршрут для получения списка всех смол
router.get('/', async (req, res) => {
  try {
    const resinsData = await readResinsData();
    res.status(200).json(resinsData.resins);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка смол' });
  }
});

// Маршрут для получения одной смолы по ID
router.get('/:id', async (req, res) => {
  try {
    const resinsData = await readResinsData();
    const resin = resinsData.resins.find(r => r.id === req.params.id);
    if (!resin) res.status(404).json({ message: 'Смола не найдена' });
    res.status(200).json(resin);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении смолы' });
  }
});

// Маршрут для обновления смолы по ID
router.patch('/:id', async (req, res) => {
  try {
    const resinsData = await readResinsData();
    const resinIndex = resinsData.resins.findIndex(r => r.id === req.params.id);
    if (resinIndex === -1) res.status(404).json({ message: 'Смола не найдена' });
    resinsData.resins[resinIndex] = { ...resinsData.resins[resinIndex], ...req.body };
    await writeResinsData(resinsData);
    res.status(200).json(resinsData.resins[resinIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении смолы' });
  }
});

// Маршрут для удаления смолы по ID
router.delete('/:id', async (req, res) => {
  try {
    const resinsData = await readResinsData();
    const resinIndex = resinsData.resins.findIndex(r => r.id === req.params.id);
    if (resinIndex === -1) res.status(404).json({ message: 'Смола не найдена' });
    resinsData.resins.splice(resinIndex, 1);
    await writeResinsData(resinsData);
    res.status(200).json({ message: 'Смола удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении смолы' });
  }
});

module.exports = router;

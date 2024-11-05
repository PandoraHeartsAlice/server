const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о соплах
const nozzlesDataPath = path.join(__dirname, '../data/nozzles.json');

// Функция для чтения данных из файла
async function readNozzlesData() {
  const data = await fs.readFile(nozzlesDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeNozzlesData(data) {
  await fs.writeFile(nozzlesDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления нового сопла
router.post('/', async (req, res) => {
  try {
    const nozzlesData = await readNozzlesData();
    const newNozzle = { id: Date.now().toString(), ...req.body };
    nozzlesData.nozzles.push(newNozzle);
    await writeNozzlesData(nozzlesData);
    res.status(201).json(newNozzle);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении нового сопла' });
  }
});

// Маршрут для получения списка всех сопел
router.get('/', async (req, res) => {
  try {
    const nozzlesData = await readNozzlesData();
    res.status(200).json(nozzlesData.nozzles);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка сопел' });
  }
});

// Маршрут для получения одного сопла по ID
router.get('/:id', async (req, res) => {
  try {
    const nozzlesData = await readNozzlesData();
    const nozzle = nozzlesData.nozzles.find(n => n.id === req.params.id);
    if (!nozzle) res.status(404).json({ message: 'Сопло не найдено' });
    res.status(200).json(nozzle);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении сопла' });
  }
});

// Маршрут для обновления сопла по ID
router.patch('/:id', async (req, res) => {
  try {
    const nozzlesData = await readNozzlesData();
    const nozzleIndex = nozzlesData.nozzles.findIndex(n => n.id === req.params.id);
    if (nozzleIndex === -1) res.status(404).json({ message: 'Сопло не найдено' });
    nozzlesData.nozzles[nozzleIndex] = { ...nozzlesData.nozzles[nozzleIndex], ...req.body };
    await writeNozzlesData(nozzlesData);
    res.status(200).json(nozzlesData.nozzles[nozzleIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении сопла' });
  }
});

// Маршрут для удаления сопла по ID
router.delete('/:id', async (req, res) => {
  try {
    const nozzlesData = await readNozzlesData();
    const nozzleIndex = nozzlesData.nozzles.findIndex(n => n.id === req.params.id);
    if (nozzleIndex === -1) res.status(404).json({ message: 'Сопло не найдено' });
    nozzlesData.nozzles.splice(nozzleIndex, 1);
    await writeNozzlesData(nozzlesData);
    res.status(200).json({ message: 'Сопло удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении сопла' });
  }
});

module.exports = router;

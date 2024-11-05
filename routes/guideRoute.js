const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о руководствах
const guidesDataPath = path.join(__dirname, '../data/guides.json');

// Функция для чтения данных из файла
async function readGuidesData() {
  const data = await fs.readFile(guidesDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeGuidesData(data) {
  await fs.writeFile(guidesDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления нового руководства
router.post('/', async (req, res) => {
  try {
    const guidesData = await readGuidesData();
    const newGuide = { id: Date.now().toString(), ...req.body };
    guidesData.guides.push(newGuide);
    await writeGuidesData(guidesData);
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении нового руководства' });
  }
});

// Маршрут для получения списка всех руководств
router.get('/', async (req, res) => {
  try {
    const guidesData = await readGuidesData();
    res.status(200).json(guidesData.guides);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка руководств' });
  }
});

// Маршрут для получения одного руководства по ID
router.get('/:id', async (req, res) => {
  try {
    const guidesData = await readGuidesData();
    const guide = guidesData.guides.find(g => g.id === req.params.id);
    if (!guide) res.status(404).json({ message: 'Руководство не найдено' });
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении руководства' });
  }
});

// Маршрут для обновления руководства по ID
router.patch('/:id', async (req, res) => {
  try {
    const guidesData = await readGuidesData();
    const guideIndex = guidesData.guides.findIndex(g => g.id === req.params.id);
    if (guideIndex === -1) res.status(404).json({ message: 'Руководство не найдено' });
    guidesData.guides[guideIndex] = { ...guidesData.guides[guideIndex], ...req.body };
    await writeGuidesData(guidesData);
    res.status(200).json(guidesData.guides[guideIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении руководства' });
  }
});

// Маршрут для удаления руководства по ID
router.delete('/:id', async (req, res) => {
  try {
    const guidesData = await readGuidesData();
    const guideIndex = guidesData.guides.findIndex(g => g.id === req.params.id);
    if (guideIndex === -1) res.status(404).json({ message: 'Руководство не найдено' });
    guidesData.guides.splice(guideIndex, 1);
    await writeGuidesData(guidesData);
    res.status(200).json({ message: 'Руководство удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении руководства' });
  }
});

module.exports = router;

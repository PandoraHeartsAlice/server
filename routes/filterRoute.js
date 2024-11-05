const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о фильтрах
const filtersDataPath = path.join(__dirname, '../data/filters.json');

// Функция для чтения данных из файла
async function readFiltersData() {
  const data = await fs.readFile(filtersDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeFiltersData(data) {
  await fs.writeFile(filtersDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления нового фильтра
router.post('/', async (req, res) => {
  try {
    const filtersData = await readFiltersData();
    const newFilter = { id: Date.now().toString(), ...req.body };
    filtersData.filters.push(newFilter);
    await writeFiltersData(filtersData);
    res.status(201).json(newFilter);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении нового фильтра' });
  }
});

// Маршрут для получения списка всех фильтров
router.get('/', async (req, res) => {
  try {
    const filtersData = await readFiltersData();
    res.status(200).json(filtersData.filters);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка фильтров' });
  }
});

// Маршрут для получения одного фильтра по ID
router.get('/:id', async (req, res) => {
  try {
    const filtersData = await readFiltersData();
    const filter = filtersData.filters.find(f => f.id === req.params.id);
    if (!filter) res.status(404).json({ message: 'Фильтр не найден' });
    res.status(200).json(filter);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении фильтра' });
  }
});

// Маршрут для обновления фильтра по ID
router.patch('/:id', async (req, res) => {
  try {
    const filtersData = await readFiltersData();
    const filterIndex = filtersData.filters.findIndex(f => f.id === req.params.id);
    if (filterIndex === -1) res.status(404).json({ message: 'Фильтр не найден' });
    filtersData.filters[filterIndex] = { ...filtersData.filters[filterIndex], ...req.body };
    await writeFiltersData(filtersData);
    res.status(200).json(filtersData.filters[filterIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении фильтра' });
  }
});

// Маршрут для удаления фильтра по ID
router.delete('/:id', async (req, res) => {
  try {
    const filtersData = await readFiltersData();
    const filterIndex = filtersData.filters.findIndex(f => f.id === req.params.id);
    if (filterIndex === -1) res.status(404).json({ message: 'Фильтр не найден' });
    filtersData.filters.splice(filterIndex, 1);
    await writeFiltersData(filtersData);
    res.status(200).json({ message: 'Фильтр удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении фильтра' });
  }
});

module.exports = router;

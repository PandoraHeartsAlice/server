const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о диаметрах
const dataPath = path.join(__dirname, '../data/coils.json');

// Функция для чтения данных из файла
async function readData() {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для получения данных о диаметрах
router.get('/', async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении данных' });
  }
});

// Маршрут для обновления данных о диаметрах
router.patch('/', async (req, res) => {
  try {
    const data = await readData();
    // Обновляем данные с учетом того, что пришло в теле запроса
    const updatedData = {
      ...data,
      diameter_coils: req.body.diameter_coils || data.diameter_coils,
      diameter_wire: req.body.diameter_wire || data.diameter_wire
    };
    await writeData(updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении данных' });
  }
});

module.exports = router;

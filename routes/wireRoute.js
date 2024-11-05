const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Путь к файлу с данными о проводах
const wiresDataPath = path.join(__dirname, '../data/wires.json');

// Функция для чтения данных из файла
async function readWiresData() {
  const data = await fs.readFile(wiresDataPath, 'utf8');
  return JSON.parse(data);
}

// Функция для записи данных в файл
async function writeWiresData(data) {
  await fs.writeFile(wiresDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Маршрут для добавления нового провода
router.post('/', async (req, res) => {
  try {
    const wiresData = await readWiresData();
    const newWire = { id: Date.now().toString(), ...req.body };
    wiresData.wires.push(newWire);
    await writeWiresData(wiresData);
    res.status(201).json(newWire);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при добавлении нового провода' });
  }
});

// Маршрут для получения списка всех проводов
router.get('/', async (req, res) => {
  try {
    const wiresData = await readWiresData();
    res.status(200).json(wiresData.wires);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка проводов' });
  }
});

// Маршрут для получения одного провода по ID
router.get('/:id', async (req, res) => {
  try {
    const wiresData = await readWiresData();
    const wire = wiresData.wires.find(w => w.id === req.params.id);
    if (!wire) res.status(404).json({ message: 'Провод не найден' });
    res.status(200).json(wire);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении провода' });
  }
});

// Маршрут для обновления провода по ID
router.patch('/:id', async (req, res) => {
  try {
    const wiresData = await readWiresData();
    const wireIndex = wiresData.wires.findIndex(w => w.id === req.params.id);
    if (wireIndex === -1) res.status(404).json({ message: 'Провод не найден' });
    wiresData.wires[wireIndex] = { ...wiresData.wires[wireIndex], ...req.body };
    await writeWiresData(wiresData);
    res.status(200).json(wiresData.wires[wireIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении провода' });
  }
});

// Маршрут для удаления провода по ID
router.delete('/:id', async (req, res) => {
  try {
    const wiresData = await readWiresData();
    const wireIndex = wiresData.wires.findIndex(w => w.id === req.params.id);
    if (wireIndex === -1) res.status(404).json({ message: 'Провод не найден' });
    wiresData.wires.splice(wireIndex, 1);
    await writeWiresData(wiresData);
    res.status(200).json({ message: 'Провод удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении провода' });
  }
});

module.exports = router;

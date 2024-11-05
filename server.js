require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const session = require("express-session");

const brushRoutes = require("./routes/brushRoute");
const wireRoutes = require("./routes/wireRoute");
const resinRoutes = require("./routes/resinRoute");
const coilsRoutes = require("./routes/coilsRoute");
const nozzleRoutes = require("./routes/nozzleRoute");
const filterRoutes = require("./routes/filterRoute");
const guideRoutes = require("./routes/guideRoute");

const app = express();
const port = 5000;

// Настройка CORS
const corsOptions = {
  origin: ["*"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Установите secure в false, если используете HTTP
  })
);

app.use("/wires", wireRoutes);
app.use("/brushes", brushRoutes);
app.use("/resins", resinRoutes);
app.use("/coils", coilsRoutes);
app.use("/nozzles", nozzleRoutes);
app.use("/filters", filterRoutes);
app.use("/guides", guideRoutes);

// Маршрут для админ-панели
app.get("/admin", (req, res) => {
  if (req.session.userId) {
    res.send("Панель управления");
  } else {
    res.redirect("/admin/login");
  }
});

// Маршрут для отображения формы входа
app.get("/admin/login", (req, res) => {
  if (req.session.userId) {
    res.redirect("/admin");
  } else {
    res.send(`
      <form action="/admin/login" method="post">
        <input type="password" name="password" placeholder="Введите пароль" required />
        <button type="submit">Войти</button>
      </form>
    `);
  }
});

// Конфигурация отправки электронной почты
let transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_EMAIL, // ваш email на Yandex
    pass: process.env.YANDEX_PASSWORD, // ваш пароль на Yandex
  },
});

app.post("/submit", (req, res) => {
  const { name, email, phone, items, total } = req.body;

  transporter.sendMail(
    {
      from: `"Имя отправителя" <${process.env.YANDEX_EMAIL}>`,
      to: "powerman.2003@yandex.ru", // ваш фиксированный адрес получателя
      subject: "Новый заказ",
      text: `Поступил новый заказ от ${name}, email клиента: ${email}. Сумма заказа: ${total}.`,
      html: `<b>Поступил новый заказ от ${name},</b><p>email клиента: ${email}.</p><p>Сумма заказа: ${total}.</p>`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка при отправке письма" });
      } else {
        console.log("Сообщение отправлено: %s", info.messageId);
        res
          .status(200)
          .json({ message: "Данные получены и письмо отправлено" });
      }
    }
  );
});

app.get("/", (req, res) => {
  res.status(200).send("Сервер работает!");
});

// Запуск HTTP-сервера
app.listen(port, () => {
  console.log(`Сервер успешно запущен на порту ${port}`);
});

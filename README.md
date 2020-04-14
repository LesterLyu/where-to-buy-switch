# where-to-buy-switch  (Canada only)
Scan availability of Nintendo Switch from Amazon.ca, Bestbuy, Staples, The Source, Walmart. Reveive real-time email update when in stock.

### How to use
- Install Node.js and dependencies
  ```sh
  npm install # or yarn install
  ```
- Configure nodemailer in mailer.js
  ```js
  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'username@gmail.com',
    pass: 'password'
  }
  });
  const send = async (text) => {
    await transporter.sendMail({
      from: '"Lester Lyu" <username@gmail.com>', // sender address
      to: "username@gmail.com, username@gmail.com", // list of receivers
      subject: "你的Switch有货了", // Subject line
      html: text // html body
    });
  };
  ```
- Run
  ```sh
  node index.js
  ```

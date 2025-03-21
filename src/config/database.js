module.exports = {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postegres",
  database: "devburguer",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },

  // STRIPE_SECRET_KEY: 'sk_test_51QWzArCpXwN5VaoWc1RnlNA3qg9tTPKA59zEf8WKrq2AxDWAtjlczcYme7wkGYxDra9nF5Vj5XjsA5tv1pmHsMgE00EgqLC3jX'
};

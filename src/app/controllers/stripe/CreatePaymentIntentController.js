"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const stripe = require("stripe")("sk_test_51QWzArCpXwN5VaoWc1RnlNA3qg9tTPKA59zEf8WKrq2AxDWAtjlczcYme7wkGYxDra9nF5Vj5XjsA5tv1pmHsMgE00EgqLC3jX");
const calculateOrderAmount = (items) => {
    const total = items.reduce((acc, current) => {
        return current.price * current.quantity + acc;
    }, 0);
    return total;
};
class CreatePaymentIntentController {
    async store(request, response) {
        const schema = Yup.object().shape({
            products: Yup.array()
                .required()
                .of(Yup.object().shape({
                id: Yup.number().required(),
                quantity: Yup.number().required(),
                price: Yup.number().required(),
            })),
        });
        try {
            schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { products } = request.body;
        const amount = calculateOrderAmount(products);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "brl",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        response.json({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?tarnsaction_id=${paymentIntent.id}`,
        });
    }
}
exports.default = new CreatePaymentIntentController();

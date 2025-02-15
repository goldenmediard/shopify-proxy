require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

app.use(cors({ origin: 'https://www.mygoldenarea.com' }));
app.use(express.json());

// Vérifier que les variables d'environnement sont bien définies
if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.error("❌ Erreur: SHOPIFY_STORE ou SHOPIFY_ACCESS_TOKEN manquant dans .env");
    process.exit(1); // Arrête le serveur si les variables sont absentes
}

// Route pour récupérer les produits Shopify
app.get('/products', async (req, res) => {
    try {
        const response = await axios.get(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products.json`, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Erreur API Shopify:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Impossible de récupérer les produits",
            details: error.response?.data || error.message
        });
    }
});

// Endpoint de santé pour Render
app.get('/health', (req, res) => {
    res.status(200).send("✅ Serveur opérationnel");
});

// Écoute sur Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proxy running on port ${PORT}`);
});

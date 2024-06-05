import express from 'express'
const app = express()
import Shopify from 'shopify-api-node'

const shopify = new Shopify({
  shopName: 'pazkie.myshopify.com',
  apiKey: process.env.API_KEY,
  password: process.env.ACCESS_TOKEN
});

const PORT = 5000

app.get('/', (req, res) => {
  res.send('<h1>Our app is running...</h1>')
})

app.get('/products', async (req, res) => {

  await shopify.product
    .list({ limit: 5 })
    .then((products) => res.send(products))
    .catch((err) => console.error(err));

})

const upsertMetafield = async (id) => {
  try {
    const checkValue = await shopify.metafield.get(id)

    const updateValue = await shopify.metafield.update(id, {
      value: checkValue.value + 1,
    })

    console.log(updateValue)

  } catch (err) {
    console.log('error')
    shopify.metafield
      .create({
        key: 'test',
        value: 0,
        type: 'integer',
        namespace: 'global',
        owner_resource: 'product',
        owner_id: 8392025211108
      })
      .then(
        (metafield) => console.log(metafield),
        (err) => console.error(err)
      );
  }
}

upsertMetafield(28177671487716)

app.listen(PORT, () => {
  console.log('server is running at port 5000');
})
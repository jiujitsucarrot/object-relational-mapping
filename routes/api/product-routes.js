const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.update(req.body, {
      where: {
        id: productId,
      },
    });

    // Handle associated tags

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagsToRemove = await ProductTag.findAll({
        where: {
          product_id: productId,
        },
      });

      const productTagIdsToRemove = productTagsToRemove
        .map(({ tag_id }) => tag_id)
        .filter((tag_id) => !req.body.tagId.includes(tag_id));

      await ProductTag.destroy({
        where: {
          id: productTagIdsToRemove,
        },
      });

      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagsToRemove.some((pt) => pt.tag_id === tag_id))
        .map((tag_id) => ({
          product_id: productId,
          tag_id,
        }));

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Delete one product by id

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.destroy({
      where: {
        id: productId,
      },
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

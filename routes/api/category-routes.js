const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories with associated products

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one category by id 

router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, {
      include: Product,
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create new category

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update category by id

router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updateCategory = await Category.update(req.body, {
      where: {
        id: categoryId,
      },
    });
    res.status(200).json(updateCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete category by its id

router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json(deletedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;



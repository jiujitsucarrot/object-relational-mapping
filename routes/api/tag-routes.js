const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags with Product data

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: Product,
    });
    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one tag by its id with Product data

router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: Product,
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create a new tag

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Update a tag name by the id value

router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: tagId,
      },
    });
    res.status(200).json(updatedTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Delete one tag by the id value

router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    await Tag.destroy({
      where: {
        id: tagId,
      },
    });
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

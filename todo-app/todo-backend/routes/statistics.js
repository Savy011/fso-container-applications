const express = require('express');
const { getAsync } = require('../redis');
const router = express.Router()

router.get('/', async (_req, res) => {
  const todoCount = await getAsync('todoCount');

  const noOfNotes = {
	  added_todos: todoCount || 0
  };
  res.status(200).json(noOfNotes)
});

module.exports = router;

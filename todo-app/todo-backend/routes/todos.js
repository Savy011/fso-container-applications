const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const currentCount = parseInt(await getAsync('todoCount'));
	let updatedCount;

	if (isNaN(currentCount)) {
		updatedCount = 1;
	} else {
		updatedCount = currentCount + 1;
	}
	
	const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
	
	await setAsync('todoCount', updatedCount);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();

  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const foundTodo = req.todo;

  res.status(200).send(foundTodo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
	const { text, done } = req.body;
  const foundTodo = req.todo;

	foundTodo.text = text || foundTodo.text;
	foundTodo.done = done || foundTodo.done;

	await foundTodo.save();
  res.send(foundTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

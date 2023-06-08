const Todo = ({ todo, onClickComplete, onClickDelete }) => {
	const doneInfo = (
		<>
			<span className="doneSpan">This todo is done</span>
			<span>
				<button onClick={onClickDelete(todo)}> Delete </button>
			</span>
		</>
	)

	const notDoneInfo = (
		<>
			<span className="notDoneSpan">
				This todo is not done
			</span>
			<span>
				<button onClick={onClickDelete(todo)}> Delete </button>
				<button onClick={onClickComplete(todo)}> Set as done </button>
			</span>
		</>
	)

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
			<span className="textSpan">
				{todo.text} 
			</span>
			{todo.done ? doneInfo : notDoneInfo}
		</div>
	)
}

export default Todo

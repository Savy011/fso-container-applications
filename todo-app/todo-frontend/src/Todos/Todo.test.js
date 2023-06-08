import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('render content', () => {
	const mockHandler = jest.fn()

	const todo = {
		text: 'Todo for jest test',
		done: false
	}

	const { container } = render(<Todo
						todo={todo}
						onClickDelete={mockHandler}
						onClickComplete={mockHandler}
		/>)

	const todoText = container.querySelector('.todoText')
	const buttons = container.querySelector('.notDoneSpan')
	
	expect(todoText).toBeDefined()
	expect(buttons).toBeDefined()
})

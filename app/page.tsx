/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Button from '@/components/Button'
import { cn } from '@/utils/css'
import { MoveLeft } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

const operatorNames = ['+', '-', '*', '/', '1/x', 'sqrt', 'x^2']
type operator = (typeof operatorNames)[number]

export default function Home() {
	const [firstNumber, setFirstNumber] = useState('0')
	const [secondNumber, setSecondNumber] = useState('0')
	const [currentOperator, setOperator] = useState<operator>()
	const [prevOperator, setPrevOperator] = useState<operator>()

	const operators: { name: operator; element?: ReactNode }[] = [
		{
			name: '1/x',
			element: (
				<>
					1/<sub className="text-base">x</sub>
				</>
			),
		},
		{
			name: 'sqrt',
			element: <>&#8730;x</>,
		},

		{
			name: 'x^2',
			element: (
				<>
					x<sup>2</sup>
				</>
			),
		},
		{ name: '*' },
		{ name: '/' },
		{ name: '+' },
		{ name: '-' },
	]

	useEffect(() => {
		if (currentOperator === undefined) return

		if (['1/x', 'sqrt', 'x^2'].includes(currentOperator)) {
			handleEqualKeyClick()
		}
	}, [currentOperator])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isNaN(Number(event.key))) {
				handleNumberKeyClick(Number(event.key))
				return
			}
			switch (event.key.toLowerCase()) {
				case '=':
					handleEqualKeyClick()
					return
				case 'enter':
					handleEqualKeyClick()
					return
				case 'backspace':
					handleDeleteKeyClick()
					return
				case 'c':
					handleClearKeyClick()
					return
				case '.':
					handleDotKeyClick()
					return
			}
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [currentOperator, prevOperator])

	//? utility functions
	function solveFloatEquasion(number: number) {
		return Number(parseFloat(number.toString()).toPrecision(15).toString()).toString()
	}
	function changeCurrentNumber(callback: (prev: string) => string) {
		if (currentOperator === prevOperator) {
			setFirstNumber(callback)
			return
		}
		setSecondNumber(callback)
	}

	//? main functions
	function handleNumberKeyClick(number: number) {
		changeCurrentNumber(prev => ((prev + number).length > 15 ? prev : prev === '0' ? number.toString() : prev + number))
	}

	function handleOperatorKeyClick(operator: operator) {
		if (['1/x', 'sqrt', 'x^2'].includes(operator) && currentOperator === operator) {
			handleEqualKeyClick()
		}
		setPrevOperator(() => (currentOperator === operator && !['1/x', 'sqrt', 'x^2'].includes(operator) ? undefined : currentOperator))
		setOperator(operator)
		setSecondNumber('0')
	}

	function handleEqualKeyClick() {
		console.log(currentOperator, prevOperator)
		setFirstNumber(prev => {
			switch (currentOperator) {
				case '+':
					return solveFloatEquasion(Number(prev) + Number(secondNumber))
				case '-':
					return solveFloatEquasion(Number(prev) - Number(secondNumber))
				case '*':
					return solveFloatEquasion(Number(prev) * Number(secondNumber))
				case '/':
					return solveFloatEquasion(Number(prev) / Number(secondNumber))
				case '1/x':
					return solveFloatEquasion(1 / Number(prev))
				case 'sqrt':
					return solveFloatEquasion(Math.sqrt(Number(prev)))
				case 'x^2':
					return solveFloatEquasion(Number(prev) ** 2)
				default:
					return prev
			}
		})
		setPrevOperator(currentOperator)
	}

	function handleDeleteKeyClick() {
		changeCurrentNumber(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
	}

	function handleClearKeyClick() {
		setFirstNumber('0')
		setSecondNumber('0')
		setOperator(undefined)
		setPrevOperator(undefined)
	}

	function handleClearEntryKeyClick() {
		changeCurrentNumber(() => '0')
	}

	function handlePercentKeyClick() {
		if (currentOperator === prevOperator) return
		setSecondNumber(prev => ((Number(prev) * Number(firstNumber)) / 100).toString())
	}

	function handleMinusToggleKeyClick() {
		changeCurrentNumber(prev => prev === "0"?prev: (prev[0] === '-' ? prev.slice(1) : '-' + prev))
	}

	function handleDotKeyClick() {
		changeCurrentNumber(prev => (prev.includes('.') ? prev : prev + '.'))
	}

	return (
		<div className={cn('w-screen h-[100svh]', 'flex flex-col items-center justify-center')}>
			<main className={cn('grid grid-cols-4 grid-rows-8 gap-2', 'relative', 'border-gray-300 dark:border-gray-700 border-4 p-2 rounded-lg')}>
				{/* screen */}
				<input
					className={cn('bg-gray-300 dark:bg-gray-700 p-6 text-end', 'col-span-4 row-span-2', 'rounded-t-md')}
					value={currentOperator === prevOperator ? firstNumber : secondNumber}
					readOnly
				/>
				{/* number keys */}
				{Array.from({ length: 9 }, (_, i) => i + 1).map((number, index) => {
					return (
						<Button
							key={`numberKey-${number}`}
							style={{ gridRowStart: Math.trunc(index / 3) + 5 }}
							onClick={() => handleNumberKeyClick(number)}>
							{number}
						</Button>
					)
				})}
				<Button
					className="row-start-8 col-start-2"
					onClick={() => handleNumberKeyClick(0)}>
					0
				</Button>
				{/* math operators */}
				{operators.map(operator => {
					return (
						<Button
							key={`operatorKey-${operator.name}`}
							onClick={() => handleOperatorKeyClick(operator.name)}>
							{operator.element ? operator.element : operator.name}
						</Button>
					)
				})}
				{/* special keys */}
				<Button
					className="col-start-4 rounded-br-md"
					onClick={() => handleEqualKeyClick()}>
					=
				</Button>
				<Button
					className="col-start-4 row-start-3 flex justify-center items-center"
					onClick={() => handleDeleteKeyClick()}>
					<MoveLeft strokeWidth={1.5} width={20}/>
				</Button>
				<Button
					className="row-start-3"
					onClick={() => handlePercentKeyClick()}>
					%
				</Button>
				<Button
					className="row-start-3"
					onClick={() => handleClearKeyClick()}>
					C
				</Button>
				<Button
					className="row-start-3"
					onClick={() => handleClearEntryKeyClick()}>
					CE
				</Button>
				<Button
					className="row-start-8 rounded-bl-md"
					onClick={() => handleMinusToggleKeyClick()}>
					<sup>+</sup>/<sub className="text-base">-</sub>
				</Button>
				<Button
					className="row-start-8"
					onClick={() => handleDotKeyClick()}>
					.
				</Button>
				<div className={cn('absolute right-6 top-2', 'text-gray-500')}>
					{currentOperator !== prevOperator
						? firstNumber.at(-1) === '.'
							? firstNumber.slice(0, -1)
							: firstNumber
						: secondNumber !== '0' && (secondNumber.at(-1) === '.' ? secondNumber.slice(0, -1) : secondNumber)}
				</div>
			</main>
		</div>
	)
}

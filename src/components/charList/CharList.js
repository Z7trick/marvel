import { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';
const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />;
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />;
		case 'confirmed':
			return <Component />;
		case 'error':
			return <ErrorMessage />;
		default:
			throw new Error('Unexpected process state');
	}
};

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
		// eslint-disable-next-line
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setItemLoading(false) : setItemLoading(true);
		getAllCharacters(offset)
			.then(onCharListLoaded)
			.then(() => setProcess('confirmed'));
	};

	const onCharListLoaded = async (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
		setCharList([...charList, ...newCharList]);
		setItemLoading(false);
		setOffset(offset + 9);
		setCharEnded(ended);
	};
	const itemRefs = useRef([]);

	const setActiveList = (id) => {
		itemRefs.current.forEach((item, i) => {
			if (i === id) {
				item.classList.add('char__item_selected');
				item.focus();
			} else {
				item.classList.remove('char__item_selected');
			}
		});
	};

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail.includes('available')) {
				imgStyle = { objectFit: 'unset' };
			}
			return (
				<CSSTransition key={item.id} timeout={500} classNames='item'>
					<li
						ref={(el) => (itemRefs.current[i] = el)}
						tabIndex={0}
						onClick={() => {
							props.onCharSelected(item.id);
							setActiveList(i);
						}}
						onKeyDown={(e) => {
							if (e.key === ' ' || e.key === 'Enter') {
								props.onCharSelected(item.id);
								setActiveList(i);
							}
						}}
						className='char__item'>
						<img style={imgStyle} src={item.thumbnail} alt={item.name} />
						<div className='char__name'>{item.name}</div>
					</li>
				</CSSTransition>
			);
		});
		return (
			<ul className='char__grid'>
				<TransitionGroup component={null}>{items}</TransitionGroup>
			</ul>
		);
	}

	const elements = useMemo(() => {
		return setContent(process, () => renderItems(charList), newItemLoading);
		// eslint-disable-next-line
	}, [process]);

	return (
		<div className='char__list'>
			{elements}
			<button
				onClick={() => onRequest(offset)}
				disabled={newItemLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				className='button button__main button__long'>
				<div className='inner'>load more</div>
			</button>
		</div>
	);
};

export default CharList;

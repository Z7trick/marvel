import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const RandomChar = () => {
	const [char, setChar] = useState({});

	const { getCharacter, clearError, process, setProcess } = useMarvelService();
	useEffect(() => {
		updateChar();
		// eslint-disable-next-line
	}, []);

	const onCharLoaded = (char) => {
		setChar(char);
	};

	const updateChar = () => {
		clearError();
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
		getCharacter(id)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'));
	};
	const onClick = () => {
		updateChar();
	};

	return (
		<div className='randomchar'>
			{setContent(process, View, char)}
			<div className='randomchar__static'>
				<p className='randomchar__title'>
					Random character for today!
					<br />
					Do you want to get to know him better?
				</p>
				<p className='randomchar__title'>Or choose another one</p>
				<button onClick={onClick} className='button button__main'>
					<div className='inner'>try it</div>
				</button>
				<img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
			</div>
		</div>
	);
};

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki } = data;
	let newDescription = description ? description : "There's no info about this character";
	if (newDescription.length > 230) {
		newDescription = newDescription.slice(0, 220).concat('...');
	}
	const notAvailableImage = thumbnail && thumbnail.includes('available') ? { objectFit: 'contain' } : null;

	return (
		<div className='randomchar__block'>
			<img style={notAvailableImage} src={thumbnail} alt='Random character' className='randomchar__img' />
			<div className='randomchar__info'>
				<p className='randomchar__name'>{name}</p>
				<p className='randomchar__descr'>{newDescription}</p>
				<div className='randomchar__btns'>
					<a href={homepage} className='button button__main'>
						<div className='inner'>homepage</div>
					</a>
					<a href={wiki} className='button button__secondary'>
						<div className='inner'>Wiki</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RandomChar;

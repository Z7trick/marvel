import './charInfo.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import PropTypes from 'prop-types';
const CharInfo = (props) => {
	const [char, setChar] = useState(null);

	const { getCharacter, clearError, process, setProcess } = useMarvelService();

	useEffect(() => {
		updateChar();
		// eslint-disable-next-line
	}, [props.charId]);

	const updateChar = () => {
		const { charId } = props;
		if (!charId) {
			return;
		}
		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'));
	};

	const onCharLoaded = (char) => {
		setChar(char);
	};

	// const skeleton = char || loading || error ? null : <Skeleton />;
	// const errorMessage = error ? <ErrorMessage /> : null;
	// const spinner = loading ? <Spinner /> : null;
	// const content = !(loading || error || !char) ? <View char={char} /> : null;
	return <div className='char__info'>{setContent(process, View, char)}</div>;
};

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = data;
	const notAvailableImage = thumbnail.includes('available');
	return (
		<>
			<div className='char__basics'>
				<img src={thumbnail} alt={name} style={notAvailableImage ? { objectFit: 'contain' } : null} />
				<div>
					<div className='char__info-name'>{name}</div>
					<div className='char__btns'>
						<a href={homepage} className='button button__main'>
							<div className='inner'>homepage</div>
						</a>
						<a href={wiki} className='button button__secondary'>
							<div className='inner'>Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className='char__descr'>{description}</div>
			<div className='char__comics'>Comics:</div>
			<ul className='char__comics-list'>
				{!comics.length > 0 ? "There's no info comics with this character" : ''}
				{/* eslint-disable-next-line */}
				{comics.map((item, i) => {
					if (i < 10) {
						const comicUrl = item.resourceURI.replace(/[^\d]/g, '').slice(1);
						return (
							<li key={i} className='char__comics-item'>
								<Link to={`/comics/${comicUrl}`}>{item.name}</Link>
							</li>
						);
					}
				})}
			</ul>
		</>
	);
};

CharInfo.propTypes = {
	charId: PropTypes.number,
};

export default CharInfo;

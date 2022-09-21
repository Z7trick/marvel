import { useState } from 'react';

import { Link } from 'react-router-dom';

import { useFormik } from 'formik';

import * as Yup from 'yup';
import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import './findChar.scss';
const FindChar = () => {
	const [char, setChar] = useState(null);

	const { getCharacterByName, error, clearError, process, setProcess } = useMarvelService();

	const updateChar = (name) => {
		clearError();

		getCharacterByName(name)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'));
	};

	const onCharLoaded = (char) => {
		setChar(char);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
		},
		onSubmit: ({ name }) => {
			updateChar(name);
		},
		validationSchema: Yup.object({
			name: Yup.string().min(2, 'Minimum 2 words').required('Name is required'),
		}),
	});
	const errorMessage = error ? (
		<div>
			<ErrorMessage />
		</div>
	) : null;
	const didFindChar = !char ? null : char.length > 0 ? (
		<div className='findChar__result'>
			<h4>The character is found!</h4>
			<Link to={`/characters/${char[0].id}`} className='btn'>
				To page
			</Link>
		</div>
	) : (
		<h5 className='not_found'>The character was not found. Check the name and try again</h5>
	);

	return (
		<div className='findChar'>
			<form onSubmit={formik.handleSubmit}>
				<label htmlFor=''>Or Find a character by name:</label>
				<div className='findChar__inner'>
					<input
						placeholder='Enter name'
						name='name'
						type='text'
						onChange={formik.handleChange}
						value={formik.values.name}
					/>
					<button disabled={process === 'loading'} className='button button__main' type='submit'>
						<div className='inner'>Find</div>
					</button>
				</div>
				{formik.touched.name && formik.errors.name ? <div className='error'>{formik.errors.name}</div> : null}
			</form>
			{didFindChar}
			{errorMessage}
		</div>
	);
};

export default FindChar;

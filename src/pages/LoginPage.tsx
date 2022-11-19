/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';
import InputElement from '../components/InputElement';
import PasswordElement from '../components/PasswordElement';
import React from 'react';
import { authQuery } from '../api';
import { loginUser } from '../state/slices/userSlice';
import { useAppDispatch } from '../state/hooks';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

type UserDataInputs = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = React.useState<boolean>(false);
	const pathState = useLocation().state as unknown as {
		from: string | undefined;
	};

	const [userData, setUserData] = React.useState<UserDataInputs>(
		{} as UserDataInputs
	);
	const navigate = useNavigate();
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		e.preventDefault();
		setUserData((initial) => ({ ...initial, [e.target.name]: e.target.value }));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (userData.email && userData.password) {
			setLoading(true);

			try {
				const res = await authQuery.post('/login', userData);
				console.log(res.data);

				if (res.status === 200 || res.status === 201) {
					toast.success('Logged in successfully');
					dispatch(
						loginUser({
							user: {} as any,
							token: res.data.user.token
						})
					);
					setTimeout(() => {
						pathState?.from ? navigate(pathState.from) : navigate('/');
					}, 2000);
				}
			} catch (err) {
				if (err instanceof AxiosError) toast.error(err.response?.data.message);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="flex justify-center items-center mt-10 flex-col h-full">
			<ToastContainer />
			<form
				className="flex flex-col mt-5 gap-4 sm:m-8 px-4 w-full bg-white p-5 md:p-12 rounded-md max-w-[40rem]"
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<div>
					<img
						src="/logo.svg"
						alt=""
						className="mx-auto h-30 w-30 object-cover"
					/>
				</div>
				<InputElement
					placeholder={'Email'}
					type={'email'}
					name={'email'}
					onChange={handleChange}
					value={userData['email']}
				/>
				<PasswordElement
					type="password"
					placeholder={'Password'}
					name={'password'}
					onChange={handleChange}
					value={userData['password']}
				/>
				<div className="flex items-center gap-5">
					<input
						className=""
						type="checkbox"
						id="rememberMe"
						name="rememberMe"
						value="remember"
					/>
					<label htmlFor="vehicle3"> Remember Me</label>
				</div>
				{loading ? (
					<button
						className="cursor-not-allowed bg-gray-300 border-gray-500 py-2 rounded-md"
						disabled
					>
						Loading....
					</button>
				) : (
					<button className="mb-3 rounded-full bg-primary p-2" type="submit">
						Sign In
					</button>
				)}
				<p className="mb-7 text-center">
					Don't have an account?{' '}
					{
						<Link to={'/account/sign-up'} className="text-primary font-bold">
							Sign up
						</Link>
					}
				</p>
				<Link to={'/'} className="text-center underline text-blue-700">
					Continue shoppping
				</Link>
			</form>
		</div>
	);
};

export default LoginPage;

import Link from "next/link";
import React from "react";
import {
	getSignInUrl,
	getSignUpUrl,
	getUser,
	signOut,
} from "@workos-inc/authkit-nextjs";
import logo from "../../../public/logo.png"
import Image from "next/image";

export default async function Navbar() {
	// Retrieves the user from the session or returns `null` if no user is signed in
	const { user } = await getUser();
	const signInUrl = await getSignInUrl();
	const signOutUrl = await getSignUpUrl();
	return (
		<header>
			{/* {JSON.stringify(user)} */}
			<div className="container flex items-center justify-between px-3 md:px-7 py-4 pt-4 mx-auto ">
				<div className="flex justify-center items-center">
					<Image src={logo} alt="logo" width={35} height={35} className="cursor-pointer mr-0.5 ml-0.5 sm:w-[45px] sm:h-[45px] sm:mr-2" />
					<div className='text-2xl sm:text-4xl tracking-wide font-mono text-center text-light-secondary font-bold ml-2'>Men<span className='text-light-heading font-normal'>trix</span></div>
				</div>

				<nav className="flex">
					{!user && (
						<Link href={signInUrl}
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-7 py-2.5 text-center text-lg sm:text-xl"
						>
							Login
						</Link>
					)}
					{user && (
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
						>
							<button type="submit"
								className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg px-7 py-2.5 text-center text-lg sm:text-xl"
							>
								Logout
							</button>
						</form>
					)}

				</nav>
			</div>
		</header>
	);
};

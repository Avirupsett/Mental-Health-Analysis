import Link from "next/link";
import React from "react";
import {
	getSignInUrl,
	getSignUpUrl,
	getUser,
	signOut,
} from "@workos-inc/authkit-nextjs";

export default async function Navbar() {
	// Retrieves the user from the session or returns `null` if no user is signed in
	const { user } = await getUser();
	const signInUrl = await getSignInUrl();
	const signOutUrl = await getSignUpUrl();
	return (
		<header>
			{/* {JSON.stringify(user)} */}
			<div className="container flex items-center justify-between py-4 px-2 mx-auto">
				<Link href={"/"} className="font-bold text-xl">
					Mental Health Analysis
				</Link>
				<nav className=" flex gap-2 ">
					{!user && (
						<Link href={signInUrl} className="bg-gray-300 px-2 py-2 rounded-md ">
							Login
						</Link>
					)}
					{user && (
						<form
							action={async () => {
								"use server";
								await signOut();
							} }
						>
							<button type="submit" className="bg-gray-300 px-2 py-2 rounded-md ">
								Logout 
							</button>
						</form>
					)}
					<Link href={"/post"} className="bg-red-500 text-white px-2 py-2 rounded-md ">
						Help ?
					</Link>
				</nav>
			</div>
		</header>
	);
};

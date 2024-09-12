import Navbar from "../components/Home/Navbar"
import Image from "next/image";
import Link from "next/link";
import {
	getSignInUrl,
	getSignUpUrl,
	getUser,
	signOut,
} from "@workos-inc/authkit-nextjs";

export default async function Home() {
	// Retrieves the user from the session or returns `null` if no user is signed in
	const { user } = await getUser();

	// Get the URL to redirect the user to AuthKit to sign in
	const signInUrl = await getSignInUrl();

	// Get the URL to redirect the user to AuthKit to sign up
	const signUpUrl = await getSignUpUrl();

	return (
		<section className="">
			<Navbar />
			<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center min-h-[100vh]">
				<div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
					<h1 className="title-font sm:text-6xl text-3xl mb-5 font-semibold font-mono tracking-normal text-light-heading !leading-tight">
						<span className="text-purple-600">Your Personalized</span>

						<br className="" />

						<span className="">Mental Health Insights</span>
					</h1>
					<p className="mb-12 leading-relaxed text-lg font-medium opacity-80">
						Your AI-powered mental wellness companion. Gain personalized
						insights from your daily life and social media to enhance your
						emotional well-being.
					</p>
					<div className="flex justify-center">
						{/* <Link href={"/auth/login"} className="inline-flex text-white bg-light-secondary border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg" >Get Started</Link> */}
						<Link
							href={signInUrl}
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-7 py-3 text-center mr-2 mb-2 text-xl"
						>
							Get Started
						</Link>
						<button className="ml-4 text-light-heading bg-light-primary border-light-heading border-opacity-60 border-2 py-3 px-8 focus:outline-none  mr-2 mb-2 rounded-md text-xl">
							Learn More
						</button>
					</div>
				</div>
				<div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
					<Image
						className="object-cover object-center rounded"
						width={700}
						height={500}
						alt="hero"
						src="https://dummyimage.com/720x600"
					/>
				</div>
			</div>
		</section>
	);
}

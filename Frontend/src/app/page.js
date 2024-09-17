import Navbar from "../components/Home/Navbar"
import hero_img from "../../public/stable_diffusion_bot.png";
import Image from "next/image";
import Link from "next/link";
import {
	getSignInUrl,
	getSignUpUrl,
	getUser,
	signOut,
} from "@workos-inc/authkit-nextjs";
import { MdAutoAwesome } from "react-icons/md";

export default async function Home() {
	// Retrieves the user from the session or returns `null` if no user is signed in
	const { user } = await getUser();

	// Get the URL to redirect the user to AuthKit to sign in
	const signInUrl = await getSignInUrl();

	// Get the URL to redirect the user to AuthKit to sign up
	const signUpUrl = await getSignUpUrl();

	return (
		<section className="min-h-[100vh]">
			<Navbar />
			<div className="container mx-auto flex px-0 py-20 md:py-0 md:flex-row flex-col items-center justify-center md:mt-[-85px]">
				<div className=" md:w-1/2  flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center px-4 md:pl-2.5 lg:pl-0">
					<span className="text-purple-700 bg-purple-100 flex px-5 py-1.5 sm:py-2.5 pr-6 rounded-full font-bold mb-4 tracking-wide text-sm sm:text-[18px]"><span className="mr-2 mt-0.5 sm:mt-0"><MdAutoAwesome/></span>AI Powered</span>
					<h1 className="title-font md:text-5xl lg:text-[56px] text-[38px] mb-5 font-bold font-mono tracking-tight text-light-heading leading-[1.3] sm:!leading-tight">
						<span className="text-purple-600">Your Personalized</span>

						<br className="" />

						<span className="">Mental Health Insights</span>
					</h1>
					<p className="mb-12 md:pr-16 lg:pr-24 xl:pr-28 leading-relaxed text-sm sm:text-[16px] sm:leading-6 lg:text-lg font-medium opacity-80">
						Your AI-powered mental wellness companion. Gain personalized
						insights from your daily life and social media to enhance your
						emotional well-being.
					</p>
					<div className="flex justify-center">
						{/* <Link href={"/auth/login"} className="inline-flex text-white bg-light-secondary border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg" >Get Started</Link> */}
						<Link
							href={user!= null ? "/api/auth/status" : signUpUrl}
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-7 py-3 text-center mr-2 mb-2 text-[15px] sm:text-xl"
						>
							Get Started
						</Link>
						<button className="ml-4 text-light-heading bg-light-primary border-light-heading border-opacity-60 border-2 py-3 px-8 focus:outline-none  mr-2 mb-2 rounded-md text-[15px] sm:text-xl">
							Learn More
						</button>
					</div>
				</div>
				<div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 hidden md:flex">
					<Image
						className="object-cover object-center rounded w-[1000px] h-[780px]"
						width={1000}
						height={1000}
						alt="hero"
						src={hero_img}
					/>
				</div>
			</div>
		</section>
	);
}

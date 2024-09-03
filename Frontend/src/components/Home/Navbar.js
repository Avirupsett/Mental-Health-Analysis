import React from 'react'

export default function Navbar() {
    return (
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-xl py-3 fixed">
            <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center justify-between">
                    <a className="flex-none text-xl font-semibold focus:outline-none focus:opacity-80" href="#" aria-label="Brand">
                        <span className="inline-flex items-center gap-x-2 text-3xl font-semibold text-white">
                            {/* <Image className="w-10 h-auto" src="../assets/img/logo/logo-short.png" alt="Logo"> */}
                            <div className='text-4xl tracking-wide font-mono text-center  text-light-secondary font-bold '>Men<span className='text-light-heading font-normal'>trix</span></div>
                        </span>
                    </a>
                    <div className="sm:hidden">
                        <button type="button" className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" id="hs-navbar-example-collapse" aria-expanded="false" aria-controls="hs-navbar-example" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-example">
                            <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                            <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </div>
                <div id="hs-navbar-example" className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block" aria-labelledby="hs-navbar-example-collapse">
                    <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                        <a className="font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200" href="#">Account</a>
                        <a className="font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200" href="#">Work</a>
                        <a className="font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200" href="#">Blog</a>
                    </div>
                </div>
            </nav>
        </header>
    )
}

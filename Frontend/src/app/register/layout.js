import Stepper from "@/components/Form/Stepper";

// export const metadata = {
//   title: 'StockDeck',
//   description: 'Dashboard, Add Stocks, Add Products, Stock Issues',
// }


export default async function RootLayout({ children }) {
   
    return (

        <div className='flex min-h-screen'>
            <div className='flex-none w-1/3 bg-light-tertiary'>
                <div className='flex items-center justify-center min-h-full'>
                    <Stepper />
                </div>
            </div>
            <div className='flex-none w-2/3 bg-light-primary'>
            {children}
            </div>

        </div>
    )
}

// export const metadata = {
//   title: 'StockDeck',
//   description: 'Dashboard, Add Stocks, Add Products, Stock Issues',
// }

export default async function RootLayout({ children }) {
  return (

    <div className='bg-gray-100'>
        {children}
       </div>
  )
}
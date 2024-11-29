'use client'

import { useState } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Input } from "../../ui/input"
import { Grid, LayoutList, Search, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
// import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { TriangleAlert } from 'lucide-react'
import { motion } from "framer-motion"
import { useTransitionRouter } from 'next-view-transitions'

const doctors = [
    {
        name: "Ms. Sharmila Mazumdar",
        specialty: "Psychologist",
        experience: "15+ years",
        avatar: "https://images.apollo247.in/doctors/da40cb91-e437-4f0f-ab4f-45ed490742b7-1710258902865.png?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-ms-sharmila-mazumdar-da40cb91-e437-4f0f-ab4f-45ed490742b7?source=Listing_Page",
        price: 1500,
        phone: "+91 9876543210",
        email: "sharmila.mazumdar@example.com"
    },
    {
        name: "Ms. Niharika Bajpai",
        specialty: "Psychologist",
        experience: "4+ years",
        avatar: "https://images.apollo247.in/doctors/0003a827-78aa-4b45-8a8c-f4f98e44af09-1702356693875.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-ms-niharika-bajpai-0003a827-78aa-4b45-8a8c-f4f98e44af09?source=Listing_Page",
        price: 2500,
        phone: "+91 9876543210",
        email: "niharika.bajpai@example.com"
    },
    {
        name: "Dr Richa Kumari",
        specialty: "Psychiatrist",
        experience: "10+ years",
        avatar: "https://images.apollo247.in/doctors/783a4253-7fbf-4e4a-9909-f6075c0b8592-1732278126206.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-richa-kumari-783a4253-7fbf-4e4a-9909-f6075c0b8592?source=Listing_Page",
        price: 1500,
        phone: "+91 9876543210",
        email: "richa.kumari@example.com"
    },
    {
        name: "Dr. Vishakha Rathi",
        specialty: "Psychologist",
        experience: "4+ years",
        avatar: "https://images.apollo247.in/doctors/bcd8c5a5-d405-47c4-b55d-871bc2dacf10.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-vishakha-rathi-bcd8c5a5-d405-47c4-b55d-871bc2dacf10?source=Listing_Page",
        price: 2000,
        phone: "+91 9876543210",
        email: "vishakha.rathi@example.com"
    },
    {
        name: "Abrar Raza",
        specialty: "Psychologist",
        experience: "8+ years",
        avatar: "https://images.apollo247.in/doctors/ae7fd5ea-790e-46b5-94c1-5a84f6afb325-1730877075825.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-abrar-raza-ae7fd5ea-790e-46b5-94c1-5a84f6afb325?source=Listing_Page",
        price: 1500,
        phone: "+91 9876543210",
        email: "abrar.raza@example.com"
    },
    {
        name: "Ms. Rajeshwari Luther",
        specialty: "Psychologist",
        experience: "23+ years",
        avatar: "https://images.apollo247.in/doctors/345a9d40-1064-4a51-93cc-ac29968c22e5-1716609919412.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-ms-rajeshwari-luther-345a9d40-1064-4a51-93cc-ac29968c22e5?source=Listing_Page",
        price: 2500,
        phone: "+91 9876543210",
        email: "rajeshwari.luther@example.com"
    },
    {
        name: "Dr. Sapna Zarwal",
        specialty: "Psychologist",
        experience: "20+ years",
        avatar: "https://images.apollo247.in/doctors/7455cb9b-79a2-452b-b05a-1c63d844c037-1727786499043.jpg?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-sapna-zarwal-7455cb9b-79a2-452b-b05a-1c63d844c037?source=Listing_Page",
        price: 1800,
        phone: "+91 9876543210",
        email: "sapna.zarwal@example.com"
    },
    {
        name: "Dr. Eric Miller",
        specialty: "Psychologist",
        experience: "3+ years",
        avatar: "https://images.apollo247.in/doctors/28c4f565-4488-4c2c-aff9-f6f26ef16990-1710258906017.png?tr=w-375,h-150,c-at_max,f-auto",
        profile: "https://www.apollo247.com/doctors/dr-eric-miller-28c4f565-4488-4c2c-aff9-f6f26ef16990?source=Listing_Page",
        price: 1200,
        phone: "+91 9876543210",
        email: "eric.miller@example.com"
    },
]

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
}
export default function Component() {
    const router = useTransitionRouter()
    const handleContinue = () => {
        router.replace('/portal/assignment')
    }
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isGridView, setIsGridView] = useState(true)
    const itemsPerPage = 8

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentDoctors = filteredDoctors.slice(startIndex, endIndex)

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const handleCopyPhone = (phone) => {
        navigator.clipboard.writeText(phone).then(() => {
            toast.success("Copied to clipboard")
        }).catch((err) => {
            console.error('Failed to copy: ', err)
            toast.error("Failed to copy")
        })
    }

    const handleEmail = (email, name) => {
        const subject = encodeURIComponent(`Appointment Request for ${name}`)
        window.location.href = `mailto:${email}?subject=${subject}`
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <motion.div {...fadeIn}>
                <Alert variant="destructive" className="mb-8 shadow-lg rounded-lg overflow-hidden">
                    <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-400 p-4 flex items-center justify-between sm:flex-row flex-col"
                        //   whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="flex items-center">
                            {/* <ExclamationTriangleIcon className="h-8 w-8 text-white mr-4" /> */}
                            <div>
                                <AlertTitle className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-start"><TriangleAlert className="h-7 w-7 text-white mr-3 inline-block" /> High Stress Detected 😰</AlertTitle>
                                        <AlertDescription className="text-sm sm:text-lg text-white">
                                    You appear to be experiencing elevated stress levels. We recommend scheduling a consultation with one of our counsellors below who can help you develop effective stress management strategies.
                                </AlertDescription>
                            </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleContinue}
                                variant="secondary"
                                className="ml-4 sm:mt-0 mt-4 whitespace-nowrap"
                            >
                                No Thanks !
                            </Button>
                        </motion.div>
                    </motion.div>
                    {/* <div className="bg-white p-4">
              <p className="text-gray-700">
                Consider the following recommendations to help reduce your stress levels and improve your well-being.
              </p>
            </div> */}
                </Alert>
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            {...fadeIn}
            transition={{ delay: 0.2, ...fadeIn.transition }}
            >
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-8"
                        placeholder="Search"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">View</span>
                    <Button
                        size="icon"
                        variant={isGridView ? "default" : "ghost"}
                        onClick={() => setIsGridView(true)}
                    >
                        <Grid className="h-4 w-4" />
                        <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                        size="icon"
                        variant={!isGridView ? "default" : "ghost"}
                        onClick={() => setIsGridView(false)}
                    >
                        <LayoutList className="h-4 w-4" />
                        <span className="sr-only">List view</span>
                    </Button>
                </div>
            </motion.div>

            <motion.div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}
            {...fadeIn}
            transition={{ delay: 0.4, ...fadeIn.transition }}
            >
                {currentDoctors.map((doctor, index) => (
                    <motion.div key={doctor.name}
                    {...fadeIn}
                    transition={{ delay: 0.2 * index, ...fadeIn.transition }}
                    >
                    <Card key={doctor.name} className={`overflow-hidden ${isGridView ? "" : "hover:bg-muted/50 transition-colors"}`}
                    
                    >
                        <CardContent className={`p-6 ${isGridView ? "" : "flex items-center space-x-6"}`}>
                            <div className={`flex ${isGridView ? "flex-col items-center text-center" : "items-center w-full"} space-y-4 ${isGridView ? "" : "space-y-0 space-x-6"}`}>
                                <div className="relative flex-shrink-0">
                                    <img
                                        alt={doctor.name}
                                        className={`rounded-full object-cover ${isGridView ? "h-24 w-24" : "h-16 w-16"}`}
                                        src={doctor.avatar}
                                    />
                                </div>
                                <div className={`${isGridView ? "" : "flex-grow ml-4"} relative w-full`}>

                                    <h3 className="font-semibold text-lg hover:underline cursor-pointer" onClick={() => window.open(doctor.profile, '_blank')}>{doctor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{doctor.specialty} | {doctor.experience}</p>
                                    <p className="text-base font-bold text-primary mt-2">₹{doctor.price} <span className="text-sm font-normal text-muted-foreground">per session</span></p>
                                    <div className={`flex mt-4 space-x-2`}>
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleCopyPhone(doctor.phone)}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleEmail(doctor.email, doctor.name)}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-1">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
                        Prev
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
                        Next
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    Results: <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} of {filteredDoctors.length}</span>
                </div>
            </div>
        </div>

    )
}
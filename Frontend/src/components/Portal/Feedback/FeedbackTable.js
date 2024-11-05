"use client"

import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { PieChart, Pie, Cell, Label } from "recharts"
import { motion } from "framer-motion"
import FeedbackLoading from "../../../app/portal/feedback/loading"
import { Search } from "lucide-react"


const DonutChart = ({ value, color }) => {
    const data = [
        { name: "Stress", value: value },
        { name: "Remaining", value: 100 - value },
    ]

    const getColor = (level) => {
        if (level < 30) return "#22c55e" // green-500
        if (level < 70) return "#eab308" // yellow-500
        return "#ef4444" // red-500
    }

    return (
        <div className="h-12 flex items-center justify-center">
            <PieChart width={60} height={60}>
                <Pie
                    data={data}
                    cx={24}
                    cy={24}
                    innerRadius={18}
                    outerRadius={25}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                >
                    <Label
                        content={({ viewBox }) => {
                            const { cx, cy } = viewBox
                            return (
                                <g>
                                    <text
                                        x={cx}
                                        y={cy}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="#111827"
                                        className="fill-primary text-xs font-bold text-gray-900"
                                    >
                                        {value}%
                                    </text>

                                </g>
                            )
                        }}
                    />
                    <Cell key="stress" fill={color} />
                    <Cell key="remaining" fill="#e5e7eb" /> {/* gray-200 */}
                </Pie>
            </PieChart>
            {/* <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-medium leading-none">{`${value}%`}</span>
      </div> */}
        </div>
    )
}

export default function FeedbackTable({ stressReport }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 5;

    useEffect(() => {
        // Filter data based on the search term
        const filtered = stressReport.filter((item) =>
            Object.values(item).some((val) =>
                val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        // Initialize filtered data on component mount
        setFilteredData(stressReport);
        setIsLoading(false);
    }, []);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (isLoading) {
        return <FeedbackLoading />
    }

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}

            className="container min-h-[calc(100vh-70px)] mx-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg ">
            <h1 className="mb-6 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">Stress Level Report ({stressReport.length})</h1>
            <div className="mb-6">

                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    id="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm mx-auto"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md max-h-[460px] overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="overflow-y-hidden">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-[100px] font-semibold text-gray-700 text-base whitespace-nowrap">Sl No.</TableHead>
                                <TableHead className="w-[250px] text-center font-semibold text-gray-700 text-base whitespace-nowrap">Submitted Date</TableHead>
                                <TableHead className="w-[250px] text-center font-semibold text-gray-700 text-base whitespace-nowrap">Stress</TableHead>
                                <TableHead className="w-[150px] text-center font-semibold text-gray-700 text-base whitespace-nowrap">Stress Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody >
                            {getCurrentPageData().map((item, index) => (
                                <motion.tr
                                    key={item['sl no.']}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    // exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="hover:bg-gray-50 transition-colors duration-150 border-2  ease-in-out"
                                >
                                    <TableCell className="font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">{item['sl no.']}</TableCell>
                                    <TableCell className="text-center text-gray-600 text-sm sm:text-base whitespace-nowrap">
                                        {item.Date} {item.Time}
                                    </TableCell>
                                    <TableCell className="text-center"><div style={{ color: item['color'].text_color, borderColor: item['color'].border_color, backgroundColor: item['color'].bg_color }} className={`inline-block text-center font-semibold text-sm sm:text-base border-2 w-[110px] rounded-full p-2 px-4`}>{item['stress type']}</div></TableCell>
                                    <TableCell className="text-center whitespace-nowrap">

                                        <DonutChart value={item['stress level']} color={item['color'].border_color} />

                                    </TableCell>
                                </motion.tr>
                            ))}

                        </TableBody>
                    </Table>

                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Button size="lg"
                    className="text-base"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </Button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button size="lg"
                    className="text-base"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </motion.div>
    );
}

'use client'
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export const generatePDF = async ( patientData, startDate, endDate, mentalStressReport) => {
  const { fullname } = patientData;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set font styles
  const titleFont = 'helvetica';
  const bodyFont = 'helvetica';
  
  // Define colors
  const primaryColor = '#1a365d';
  const secondaryColor = '#2d3748';
  const textColor = '#1a202c';
  const lightColor = '#4a5568';
  const accentColor = '#3182ce';
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper functions
  const addPageIfNeeded = (height, currentY) => {
    if (currentY + height > pageHeight - margin - 5) { // Account for footer
      doc.addPage();
      return margin;
    }
    return currentY;
  };
  
  // Add watermark (centered logo)
//   const addWatermark = () => {
//     doc.setTextColor(248, 248, 248);
//     doc.setFontSize(48);
//     doc.setFont(titleFont, 'bold');
    
//     const logoText = "MENTAL HEALTH";
//     const textWidth = doc.getTextWidth(logoText);
//     doc.text(logoText, (pageWidth - textWidth) / 2, pageHeight / 2 - 10, { angle: 45 });
    
//     const logoText2 = "PROFESSIONALS";
//     const textWidth2 = doc.getTextWidth(logoText2);
//     doc.text(logoText2, (pageWidth - textWidth2) / 2, pageHeight / 2 + 10, { angle: 45 });
    
//     doc.setTextColor(0, 0, 0);
//   };
  
  // Add header section
  const addHeader = () => {
    // Header bar
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 12, 'F');
    
    // Title
    doc.setTextColor(primaryColor);
    doc.setFontSize(24);
    doc.setFont(titleFont, 'bold');
    doc.text('STRESS ANALYSIS REPORT', margin, 30);
    
    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(lightColor);
    doc.setFont(bodyFont, 'normal');
    doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, margin, 40);
    doc.text(`Period: ${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`, margin, 46);
    doc.text(`Patient ID: ${patientData.user_id.substring(5,)}`, margin, 52);
    
    return 62; // Return next Y position
  };
  
  // Add patient information section
  const addPatientInfo = (startY) => {
    let yPos = startY;
    
    // Section header
    doc.setFillColor(accentColor);
    doc.rect(margin, yPos, 3, 16, 'F');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont(titleFont, 'bold');
    doc.text('Patient Information', margin + 8, yPos + 10);
    yPos += 25;
    
    // Info grid
    const infoItems = [
      ['Name', `${fullname}`, 'Gender', patientData.gender],
      ['Age', Math.floor(
                  (new Date().getTime() - new Date(patientData.dateofbirth).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                ).toString(), 'Occupation', mentalStressReport.occupation],
      [ 'Email', patientData.email, 'Last Visit', new Date(mentalStressReport.LatestUserResponses[0].created_at).toLocaleDateString() ],
    ];
    
    doc.setFontSize(10);
    const colWidth = (contentWidth - 10) / 2;
    
    infoItems.forEach((row, index) => {
      const y = yPos + (index * 12);
      
      // First column
      doc.setFont(bodyFont, 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(`${row[0]}:`, margin, y);
      doc.setFont(bodyFont, 'normal');
      doc.setTextColor(textColor);
      doc.text(row[1], margin + 25, y);
      
      // Second column
      doc.setFont(bodyFont, 'bold');
      doc.setTextColor(secondaryColor);
      doc.text(`${row[2]}:`, margin + colWidth, y);
      doc.setFont(bodyFont, 'normal');
      doc.setTextColor(textColor);
      doc.text(row[3], margin + colWidth + 25, y);
    });
    
    return yPos + 45;
  };
  
  // Add mental status exam section
  const addMentalStatusExam = (startY) => {
    let yPos = addPageIfNeeded(120, startY);
    
    // Section header
    doc.setFillColor(accentColor);
    doc.rect(margin, yPos, 3, 16, 'F');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont(titleFont, 'bold');
    doc.text('Mental Status Examination', margin + 8, yPos + 10);
    yPos += 25;
    
    // Stress level indicator
    doc.setFontSize(11);
    doc.setFont(bodyFont, 'bold');
    doc.text('Stress Level base on Q&A', margin, yPos);
    yPos += 8;
    
    const barWidth = 100;
    const barHeight = 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, barWidth, barHeight, 'F');
    
    const averageStressBasedOnQA =  mentalStressReport.averageStressBasedOnQA >= 80 ? '#e53e3e' : 
                        mentalStressReport.averageStressBasedOnQA >= 50 ? '#ed8936' : '#48bb78';
    
    doc.setFillColor(averageStressBasedOnQA);
    doc.rect(margin, yPos, mentalStressReport.averageStressBasedOnQA, barHeight, 'F');
    doc.setFontSize(10);
    doc.text(`${mentalStressReport.averageStressBasedOnQA.toFixed(2)}%`, margin + barWidth + 5, yPos + 4);
    yPos += 15;

    // Stress level indicator
    doc.setFontSize(11);
    doc.setFont(bodyFont, 'bold');
    doc.text('Stress Level base on Emotions', margin, yPos);
    yPos += 8;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, barWidth, barHeight, 'F');

    const averageStressBasedOnEmotions =  mentalStressReport.averageStressBasedOnEmotions >= 80 ? '#e53e3e' : 
                        mentalStressReport.averageStressBasedOnEmotions >= 50 ? '#ed8936' : '#48bb78';

    doc.setFillColor(averageStressBasedOnEmotions);
    doc.rect(margin, yPos, mentalStressReport.averageStressBasedOnEmotions, barHeight, 'F');
    doc.setFontSize(10);
    doc.text(`${mentalStressReport.averageStressBasedOnEmotions.toFixed(2)}%`, margin + barWidth + 5, yPos + 4);
    yPos += 15;

    // Stress level indicator
    doc.setFontSize(11);
    doc.setFont(bodyFont, 'bold');
    doc.text('Overall Stress Level', margin, yPos);
    yPos += 8;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, barWidth, barHeight, 'F');

    const totalStress =  mentalStressReport.totalStress >= 80 ? '#e53e3e' : 
                        mentalStressReport.totalStress >= 50 ? '#ed8936' : '#48bb78';

    doc.setFillColor(totalStress);
    doc.rect(margin, yPos, mentalStressReport.totalStress, barHeight, 'F');
    doc.setFontSize(10);
    doc.text(`${mentalStressReport.totalStress.toFixed(2)}%`, margin + barWidth + 5, yPos + 4);
    yPos += 20;
    
    // Status items
    const items = [
      { label: 'Mood', value: mentalStressReport.moodState },
      { label: 'Affect', value: mentalStressReport.affect },
    //   { label: 'Behavior', value: mentalStatusExam.behavior }
    ];
    
    items.forEach(item => {
      yPos = addPageIfNeeded(20, yPos);
      doc.setFont(bodyFont, 'bold');
      doc.text(item.label + ':', margin, yPos);
      doc.setFont(bodyFont, 'normal');
      const lines = doc.splitTextToSize(item.value, contentWidth - 40);
      doc.text(lines, margin + 40, yPos);
      yPos += lines.length * 6 + 5;
    });
    
    return yPos;
  };
  
  // Add case history section
  const addCaseHistory = (startY) => {
    let yPos = addPageIfNeeded(60, startY);
    
    // Section header
    doc.setFillColor(accentColor);
    doc.rect(margin, yPos, 3, 16, 'F');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont(titleFont, 'bold');
    doc.text('Case History', margin + 8, yPos + 10);
    yPos += 25;
    
    // // Presenting complaints
    // doc.setFontSize(12);
    // doc.setFont(titleFont, 'bold');
    // doc.text('Presenting Complaints', margin, yPos);
    // yPos += 10;
    
    // caseHistory.presentingComplaints.forEach(complaint => {
    //   yPos = addPageIfNeeded(40, yPos);
      
    //   doc.setFillColor(248, 250, 252);
    //   doc.rect(margin, yPos, contentWidth, 25, 'F');
      
    //   doc.setFontSize(10);
    //   doc.setFont(bodyFont, 'bold');
    //   doc.text(complaint.description, margin + 5, yPos + 6);
      
    //   doc.setFont(bodyFont, 'normal');
    //   doc.text(`Duration: ${complaint.duration}`, margin + 5, yPos + 15);
    //   doc.text(complaint.notes, margin + 5, yPos + 22);
      
    //   yPos += 30;
    // });
    
    // Personal history
    yPos = addPageIfNeeded(40, yPos);
    doc.setFontSize(12);
    doc.setFont(titleFont, 'bold');
    doc.text('Personal History', margin, yPos);
    yPos += 10;

      yPos = addPageIfNeeded(25, yPos);
      
      doc.setFillColor(248, 250, 252);
      doc.rect(margin , yPos - 5, contentWidth - 8, 10, 'F');
      
      
      doc.setFontSize(10);
      doc.setFont(bodyFont, 'normal');
      doc.text(mentalStressReport.personalHistory === "Yes" ? "There is a personal history of mental health issues." : mentalStressReport.personalHistory === "Maybe" ? "There is a possible personal history of mental health issues." : "There is no personal history of mental health issues.", margin + 1, yPos + 1);
      
      yPos += 15;

      // Family history
    yPos = addPageIfNeeded(40, yPos);
    doc.setFontSize(12);
    doc.setFont(titleFont, 'bold');
    doc.text('Family History', margin, yPos);
    yPos += 10;

      yPos = addPageIfNeeded(25, yPos);
      
      doc.setFillColor(248, 250, 252);
      doc.rect(margin , yPos - 5, contentWidth - 8, 10, 'F');
      
      
      doc.setFontSize(10);
      doc.setFont(bodyFont, 'normal');
      doc.text(mentalStressReport.familyHistory == "Yes" ? "There is a family history of mental health issues." : "There is no family history of mental health issues.", margin + 1, yPos + 1);
      
      yPos += 15;

        // Medical history
    yPos = addPageIfNeeded(40, yPos);
    doc.setFontSize(12);
    doc.setFont(titleFont, 'bold');
    doc.text('Medical History', margin, yPos);
    yPos += 10;

      yPos = addPageIfNeeded(25, yPos);
      
      doc.setFillColor(248, 250, 252);
      doc.rect(margin , yPos - 5, contentWidth - 8, 10, 'F');
      
      
      doc.setFontSize(10);
      doc.setFont(bodyFont, 'normal');
      doc.text(mentalStressReport.medicalHistory == "Yes" ? "There is a medical history of mental health issues." : "There is no medical history of mental health issues.", margin + 1, yPos + 1);
      
      yPos += 15;

      doc.setFontSize(12);
    doc.setFont(titleFont, 'bold');
    doc.text('Strengths', margin, yPos);
    yPos += 5;

    // Strengths
    doc.setFontSize(10);
    mentalStressReport.strengths.forEach((strength, index) => {
      yPos = addPageIfNeeded(10, yPos);
      
      doc.setFillColor(accentColor);
      doc.circle(margin + 3, yPos + 2, 1, 'F');
      
      doc.setFont(bodyFont, 'normal');
      doc.text(strength, margin + 8, yPos + 3);
      
      yPos += 8;
    });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont(titleFont, 'bold');
    doc.text('Challenges', margin, yPos);
    yPos += 5;
    // Challenges
    doc.setFontSize(10);
    mentalStressReport.challenges.forEach((challenge, index) => {
      yPos = addPageIfNeeded(10, yPos);
      
      doc.setFillColor(accentColor);
      doc.circle(margin + 3, yPos + 2, 1, 'F');
      
      doc.setFont(bodyFont, 'normal');
      doc.text(challenge, margin + 8, yPos + 3);
      
      yPos += 8;
    });
    
    // caseHistory.personalHistory.significantLifeEvents.forEach(event => {
    //   yPos = addPageIfNeeded(25, yPos);
      
    //   doc.setFillColor(248, 250, 252);
    //   doc.rect(margin + 8, yPos - 2, contentWidth - 8, 20, 'F');
      
    //   doc.setFillColor(accentColor);
    //   doc.circle(margin + 4, yPos + 8, 2, 'F');
      
    //   doc.setFontSize(10);
    //   doc.setFont(bodyFont, 'bold');
    //   doc.text(`${event.date}: ${event.event}`, margin + 12, yPos + 6);
    //   doc.setFont(bodyFont, 'normal');
    //   doc.text(event.impact, margin + 12, yPos + 14);
      
    //   yPos += 25;
    // });
    
    return yPos;
  };
  
  // Add summary section
  const addSummary = (startY) => {
    let yPos = addPageIfNeeded(80, startY);
    
    // Section header
    doc.setFillColor(accentColor);
    doc.rect(margin, yPos, 3, 16, 'F');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont(titleFont, 'bold');
    doc.text('Summary and Recommendations', margin + 8, yPos + 10);
    yPos += 20;
    
    // Summary box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, contentWidth, 15, 'F');
    
    const summaryText = mentalStressReport.stressLevel >= 8
      ? `${fullname} presents with severe stress symptoms requiring immediate attention.`
      : mentalStressReport.stressLevel >= 5
      ? `${fullname} shows moderate stress levels with some impact on daily functioning.`
      : `${fullname} exhibits mild stress symptoms with good coping mechanisms.`;
    
    doc.setFontSize(10);
    doc.setFont(bodyFont, 'normal');
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 10);
    doc.text(summaryLines, margin + 5, yPos + 8);
    yPos += 25;
    
    // Recommendations
    doc.setFont(bodyFont, 'bold');
    doc.text('Recommendations:', margin, yPos);
    yPos += 8;
    
    const recommendations = [
      "Regular stress management exercises",
      "Balanced work-life schedule",
      "Sleep hygiene improvement",
      "Follow-up in 4-6 weeks"
    ];
    
    recommendations.forEach(rec => {
      doc.setFillColor(accentColor);
      doc.circle(margin + 3, yPos + 2, 1, 'F');
      doc.setFont(bodyFont, 'normal');
      doc.text(rec, margin + 8, yPos + 3);
      yPos += 8;
    });
    
    return yPos;
  };
  
  // Add footer
  const addFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(primaryColor);
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont(bodyFont, 'normal');
      
      const text = `Page ${i} of ${totalPages} | Confidential Report @https://mentrix-app.vercel.app | ${format(new Date(), 'yyyy-MM-dd')}`;
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, pageHeight - 5);
    }
  };
  
  try {
    // Add watermark to first page only
    // addWatermark();
    
    // Add content
    let yPosition = addHeader();
    yPosition = addPatientInfo(yPosition);
    yPosition = addMentalStatusExam(yPosition);
    yPosition = addCaseHistory(yPosition);
    addSummary(yPosition);
    addFooter();
    
    // Save the PDF
    const fileName = `Stress_Analysis_Report_${fullname}_${format(new Date(), 'yyyyMMdd')}.pdf`;
    doc.save(fileName);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating PDF:', error);
    return Promise.reject(error);
  }
};
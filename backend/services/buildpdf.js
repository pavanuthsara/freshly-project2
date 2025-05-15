import PDFDocument from 'pdfkit';

function buildPdf(complaints, dataCallback, endCallback) {
    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // Header with company branding
    doc
        .font('Helvetica-Bold')
        .fontSize(30)
        .fillColor('#2ecc71')
        .text('feshly.lk', {
            align: 'center'
        });

    doc
        .moveDown(0.5)
        .fontSize(12)
        .fillColor('gray')
        .text('Complaint Management Report', {
            align: 'center'
        });

    // Divider line
    doc
        .moveDown(1)
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .strokeColor('#2ecc71')
        .stroke();

    // Complaints section
    doc
        .moveDown(1.5)
        .font('Helvetica')
        .fontSize(20)
        .fillColor('black')
        .text('User Complaints', {
            align: 'left',
            underline: true
        });

    // Process each complaint
    complaints.forEach((complaint, index) => {
        doc
            .moveDown(1)
            .fontSize(14)
            .fillColor('#333333')
            .text(`Complaint #${index + 1}`, {
                align: 'left'
            });

        doc
            .moveDown(0.5)
            .fontSize(12)
            .fillColor('#666666')
            .text(`Type: ${complaint.type}`, {
                indent: 20
            })
            .text(`Description: ${complaint.description}`, {
                indent: 20
            })
            .text(`Contact: ${complaint.contactNo}`, {
                indent: 20
            });

        // Add separator between complaints (except last one)
        if (index < complaints.length - 1) {
            doc
                .moveDown(0.5)
                .lineWidth(0.5)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .strokeColor('#eeeeee')
                .stroke();
        }
    });

    // Footer
    doc
        .moveDown(2)
        .fontSize(10)
        .fillColor('gray')
        .text(`Generated on: ${new Date().toLocaleDateString()}`, {
            align: 'center'
        })
        .text('feshly.lk - All rights reserved', {
            align: 'center'
        });

    doc.end();
}

export default buildPdf;